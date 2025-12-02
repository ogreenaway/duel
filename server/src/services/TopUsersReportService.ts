import { ObjectId } from "mongodb";
import { Platform } from "../models/TaskModel";
import { User } from "../models/UserModel";
import mongoDb from "../database/MongoDb";

export type SortBy =
  | "likes"
  | "comments"
  | "shares"
  | "conversion"
  | "composite";

export interface TopUsersReportParams {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  likeWeight?: number;
  commentWeight?: number;
  shareWeight?: number;
  reachWeight?: number;
  conversionWeight?: number;
  platform?: Platform;
}

export interface UserReportStats {
  user: User;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalReach: number;
  totalConversion: number;
  compositeScore: number;
}

export interface PaginatedTopUsersReport {
  data: UserReportStats[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const MAX_LIMIT = 100;
const DEFAULT_WEIGHTS = {
  likeWeight: 0.2,
  commentWeight: 0.2,
  shareWeight: 0.2,
  reachWeight: 0.2,
  conversionWeight: 0.2,
};

/**
 * Safely parse a number, defaulting to 0 if invalid
 */
function safeNumber(value: any): number {
  if (typeof value === "number" && !isNaN(value) && isFinite(value)) {
    return value;
  }
  return 0;
}

/**
 * Get top users report based on various metrics
 */
export async function getTopUsersReport(
  params: TopUsersReportParams = {}
): Promise<PaginatedTopUsersReport> {
  const db = mongoDb.getDb();

  const {
    page = 1,
    limit = 20,
    sortBy = "composite",
    likeWeight = DEFAULT_WEIGHTS.likeWeight,
    commentWeight = DEFAULT_WEIGHTS.commentWeight,
    shareWeight = DEFAULT_WEIGHTS.shareWeight,
    reachWeight = DEFAULT_WEIGHTS.reachWeight,
    conversionWeight = DEFAULT_WEIGHTS.conversionWeight,
    platform,
  } = params;

  // Validate pagination
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  // Build match filter for platform if provided
  const taskMatchFilter: any = {};
  if (platform) {
    taskMatchFilter.platform = platform;
  }

  // Aggregate tasks to get user statistics
  const taskAggregation = [
    { $match: taskMatchFilter },
    {
      $group: {
        _id: "$user_id",
        totalLikes: { $sum: { $ifNull: ["$likes", 0] } },
        totalComments: { $sum: { $ifNull: ["$comments", 0] } },
        totalShares: { $sum: { $ifNull: ["$shares", 0] } },
        totalReach: { $sum: { $ifNull: ["$reach", 0] } },
      },
    },
  ];

  // Aggregate programs to get conversion (total_sales_attributed)
  const programAggregation = [
    {
      $group: {
        _id: "$user_id",
        totalConversion: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ["$total_sales_attributed", null] },
                  { $eq: [{ $type: "$total_sales_attributed" }, "number"] },
                ],
              },
              "$total_sales_attributed",
              0,
            ],
          },
        },
      },
    },
  ];

  // Execute aggregations
  const [taskStats, programStats] = await Promise.all([
    db.tasks.aggregate(taskAggregation).toArray(),
    db.programs.aggregate(programAggregation).toArray(),
  ]);

  // Create maps for quick lookup
  // Note: _id from aggregation will be the user_id value (could be ObjectId or string)
  const taskStatsMap = new Map();
  const programStatsMap = new Map();

  // Process task stats - handle both ObjectId and string user_ids
  for (const stat of taskStats) {
    const userId =
      stat._id instanceof ObjectId
        ? stat._id.toString()
        : stat._id?.toString() || "";

    if (userId) {
      taskStatsMap.set(userId, {
        totalLikes: safeNumber(stat.totalLikes),
        totalComments: safeNumber(stat.totalComments),
        totalShares: safeNumber(stat.totalShares),
        totalReach: safeNumber(stat.totalReach),
      });
    }
  }

  // Process program stats
  for (const stat of programStats) {
    const userId =
      stat._id instanceof ObjectId
        ? stat._id.toString()
        : stat._id?.toString() || "";

    if (userId) {
      programStatsMap.set(userId, {
        totalConversion: safeNumber(stat.totalConversion),
      });
    }
  }

  // Get all unique user IDs
  const userIds = new Set([
    ...Array.from(taskStatsMap.keys()),
    ...Array.from(programStatsMap.keys()),
  ]);

  // Convert string IDs to ObjectId for querying users
  const userIdsArray = Array.from(userIds)
    .map((id) => {
      try {
        if (ObjectId.isValid(id)) {
          return new ObjectId(id);
        }
        return null;
      } catch {
        return null;
      }
    })
    .filter((id): id is ObjectId => id !== null);

  // Fetch users
  const users =
    userIdsArray.length > 0
      ? await db.users
          .find({
            _id: { $in: userIdsArray },
          } as any)
          .toArray()
      : [];

  // Calculate stats for each user
  const userStatsList: UserReportStats[] = users.map((user) => {
    const userId = user._id.toString();
    const taskStats = taskStatsMap.get(userId) || {
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      totalReach: 0,
    };
    const programStats = programStatsMap.get(userId) || {
      totalConversion: 0,
    };

    // Calculate composite score
    // Normalize values (using max values from all users for normalization)
    // For simplicity, we'll use raw values with weights
    const compositeScore =
      taskStats.totalLikes * likeWeight +
      taskStats.totalComments * commentWeight +
      taskStats.totalShares * shareWeight +
      taskStats.totalReach * reachWeight +
      programStats.totalConversion * conversionWeight;

    return {
      user,
      totalLikes: taskStats.totalLikes,
      totalComments: taskStats.totalComments,
      totalShares: taskStats.totalShares,
      totalReach: taskStats.totalReach,
      totalConversion: programStats.totalConversion,
      compositeScore,
    };
  });

  // Sort based on sortBy parameter
  let sortedStats = [...userStatsList];
  switch (sortBy) {
    case "likes":
      sortedStats.sort((a, b) => b.totalLikes - a.totalLikes);
      break;
    case "comments":
      sortedStats.sort((a, b) => b.totalComments - a.totalComments);
      break;
    case "shares":
      sortedStats.sort((a, b) => b.totalShares - a.totalShares);
      break;
    case "conversion":
      sortedStats.sort((a, b) => b.totalConversion - a.totalConversion);
      break;
    case "composite":
    default:
      sortedStats.sort((a, b) => b.compositeScore - a.compositeScore);
      break;
  }

  // Apply pagination
  const total = sortedStats.length;
  const paginatedData = sortedStats.slice(skip, skip + limitNum);

  return {
    data: paginatedData,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

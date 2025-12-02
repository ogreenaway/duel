import { Platform } from "../models/TaskModel";
import { User } from "../models/UserModel";
import mongoDb from "../database/MongoDb";

export type SortBy = "likes" | "comments" | "shares";

export interface TopUsersReportParams {
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  platform?: Platform;
}

export interface UserReportStats {
  user: User;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalReach: number;
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

/**
 * Get top users report based on various metrics
 */
export async function getTopUsersReport(
  params: TopUsersReportParams = {},
): Promise<PaginatedTopUsersReport> {
  const db = mongoDb.getDb();

  const { page = 1, limit = 20, sortBy = "likes", platform } = params;

  // Validate pagination
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  // Determine sort field
  const sortField = `total${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`;

  // Build aggregation pipeline:
  // 1. Filter by platform (if provided)
  // 2. Group by user_id to sum metrics
  // 3. Join with users collection
  // 4. Sort by the selected metric
  // 5. Get total count and paginated data
  const matchStage: any = {};
  if (platform) {
    matchStage.platform = platform;
  }

  const result = await db.tasks
    .aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$user_id",
          totalLikes: { $sum: { $ifNull: ["$likes", 0] } },
          totalComments: { $sum: { $ifNull: ["$comments", 0] } },
          totalShares: { $sum: { $ifNull: ["$shares", 0] } },
          totalReach: { $sum: { $ifNull: ["$reach", 0] } },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $sort: { [sortField]: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limitNum }],
          total: [{ $count: "count" }],
        },
      },
    ])
    .toArray();

  const data = result[0]?.data || [];
  const total = result[0]?.total[0]?.count || 0;

  // Transform results to match interface
  const transformedData: UserReportStats[] = data.map((item: any) => ({
    user: item.user,
    totalLikes: item.totalLikes || 0,
    totalComments: item.totalComments || 0,
    totalShares: item.totalShares || 0,
    totalReach: item.totalReach || 0,
  }));

  return {
    data: transformedData,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

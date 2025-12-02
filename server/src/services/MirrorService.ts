import { ObjectId } from "mongodb";
import { User } from "@src/models/UserModel";
import mongoDb from "../database/MongoDb";

export interface PaginatedMirrorUsers {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const MAX_LIMIT = 100;

/**
 * Get users with nested programs and tasks (mirror structure)
 */
export async function getMirrorUsers(
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedMirrorUsers> {
  const db = mongoDb.getDb();

  // Validate pagination
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  // Aggregate users with programs and tasks
  const result = await db.users
    .aggregate([
      // Lookup programs for each user
      {
        $lookup: {
          from: "programs",
          localField: "_id",
          foreignField: "user_id",
          as: "programs",
        },
      },
      // For each program, lookup its tasks
      {
        $lookup: {
          from: "tasks",
          localField: "programs._id",
          foreignField: "program_id",
          as: "allTasks",
        },
      },
      // Reshape the data to match the mirror structure
      {
        $project: {
          user_id: { $toString: "$_id" },
          name: 1,
          email: 1,
          instagram_handle: 1,
          tiktok_handle: 1,
          joined_at: 1,
          advocacy_programs: {
            $map: {
              input: "$programs",
              as: "program",
              in: {
                program_id: { $toString: "$$program._id" },
                brand: "$$program.brand",
                total_sales_attributed: "$$program.total_sales_attributed",
                tasks_completed: {
                  $filter: {
                    input: "$allTasks",
                    as: "task",
                    cond: {
                      $eq: ["$$task.program_id", "$$program._id"],
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Transform tasks_completed to match mirror structure
      {
        $project: {
          user_id: 1,
          name: 1,
          email: 1,
          instagram_handle: 1,
          tiktok_handle: 1,
          joined_at: 1,
          advocacy_programs: {
            $map: {
              input: "$advocacy_programs",
              as: "program",
              in: {
                program_id: "$$program.program_id",
                brand: "$$program.brand",
                total_sales_attributed: "$$program.total_sales_attributed",
                tasks_completed: {
                  $map: {
                    input: "$$program.tasks_completed",
                    as: "task",
                    in: {
                      task_id: {
                        $cond: {
                          if: { $ne: ["$$task._id", null] },
                          then: { $toString: "$$task._id" },
                          else: {
                            $ifNull: ["$$task.legacy_task_id", null],
                          },
                        },
                      },
                      platform: "$$task.platform",
                      post_url: "$$task.post_url",
                      likes: "$$task.likes",
                      comments: "$$task.comments",
                      shares: "$$task.shares",
                      reach: "$$task.reach",
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Get total count and paginated data
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

  return {
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

/**
 * Get a single user with nested programs and tasks by user_id
 */
export async function getMirrorUserById(userId: string): Promise<User | null> {
  const db = mongoDb.getDb();

  let userObjectId: ObjectId;
  try {
    userObjectId = new ObjectId(userId);
  } catch {
    return null;
  }

  const result = await db.users
    .aggregate([
      { $match: { _id: userObjectId } },
      // Lookup programs for the user
      {
        $lookup: {
          from: "programs",
          localField: "_id",
          foreignField: "user_id",
          as: "programs",
        },
      },
      // For each program, lookup its tasks
      {
        $lookup: {
          from: "tasks",
          localField: "programs._id",
          foreignField: "program_id",
          as: "allTasks",
        },
      },
      // Reshape the data to match the mirror structure
      {
        $project: {
          user_id: { $toString: "$_id" },
          name: 1,
          email: 1,
          instagram_handle: 1,
          tiktok_handle: 1,
          joined_at: 1,
          advocacy_programs: {
            $map: {
              input: "$programs",
              as: "program",
              in: {
                program_id: { $toString: "$$program._id" },
                brand: "$$program.brand",
                total_sales_attributed: "$$program.total_sales_attributed",
                tasks_completed: {
                  $filter: {
                    input: "$allTasks",
                    as: "task",
                    cond: {
                      $eq: ["$$task.program_id", "$$program._id"],
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Transform tasks_completed to match mirror structure
      {
        $project: {
          user_id: 1,
          name: 1,
          email: 1,
          instagram_handle: 1,
          tiktok_handle: 1,
          joined_at: 1,
          advocacy_programs: {
            $map: {
              input: "$advocacy_programs",
              as: "program",
              in: {
                program_id: "$$program.program_id",
                brand: "$$program.brand",
                total_sales_attributed: "$$program.total_sales_attributed",
                tasks_completed: {
                  $map: {
                    input: "$$program.tasks_completed",
                    as: "task",
                    in: {
                      task_id: {
                        $cond: {
                          if: { $ne: ["$$task._id", null] },
                          then: { $toString: "$$task._id" },
                          else: {
                            $ifNull: ["$$task.legacy_task_id", null],
                          },
                        },
                      },
                      platform: "$$task.platform",
                      post_url: "$$task.post_url",
                      likes: "$$task.likes",
                      comments: "$$task.comments",
                      shares: "$$task.shares",
                      reach: "$$task.reach",
                    },
                  },
                },
              },
            },
          },
        },
      },
    ])
    .toArray();

  if (result.length === 0) {
    return null;
  }

  return result[0] as User;
}

import { Filter, ObjectId } from "mongodb";
import { Task, TaskWithSales } from "../models/TaskModel";

import mongoDb from "../database/MongoDb";

const MAX_LIMIT = 10000;

export interface PaginatedTasks {
  data: TaskWithSales[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAllTasks(
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedTasks> {
  const db = mongoDb.getDb();

  // Ensure page is at least 1
  const pageNum = Math.max(1, page);
  // Cap limit at MAX_LIMIT and ensure it's at least 1
  const limitNum = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  // Use aggregation to join with programs collection
  const [result, total] = await Promise.all([
    db.tasks
      .aggregate([
        // Lookup the program to get total_sales_attributed
        {
          $lookup: {
            from: "programs",
            localField: "program_id",
            foreignField: "_id",
            as: "program",
          },
        },
        // Unwind the program array (should be 0 or 1 element)
        {
          $unwind: {
            path: "$program",
            preserveNullAndEmptyArrays: true,
          },
        },
        // Project all task fields plus total_sales_attributed
        {
          $project: {
            _id: 1,
            legacy_task_id: 1,
            user_id: 1,
            program_id: 1,
            platform: 1,
            post_url: 1,
            likes: 1,
            comments: 1,
            shares: 1,
            reach: 1,
            total_sales_attributed: "$program.total_sales_attributed",
          },
        },
        // Pagination
        { $skip: skip },
        { $limit: limitNum },
      ])
      .toArray(),
    db.tasks.countDocuments(),
  ]);

  return {
    data: result as TaskWithSales[],
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

export function getTaskById(id: string): Promise<Task | null> {
  const db = mongoDb.getDb();
  return db.tasks.findOne({ _id: new ObjectId(id) } as unknown as Filter<Task>);
}

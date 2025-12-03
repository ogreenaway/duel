import { Filter, ObjectId } from "mongodb";

import { Task } from "../models/TaskModel";
import mongoDb from "../database/MongoDb";

const MAX_LIMIT = 10000;

export interface PaginatedTasks {
  data: Task[];
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

  const [tasks, total] = await Promise.all([
    db.tasks.find().skip(skip).limit(limitNum).toArray(),
    db.tasks.countDocuments(),
  ]);

  return {
    data: tasks,
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

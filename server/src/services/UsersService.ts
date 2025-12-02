import { ObjectId } from "mongodb";
import { User } from "../types/types";
import mongoDb from "../repos/MongoDb";

const MAX_LIMIT = 100;

export interface PaginatedUsers {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAllUsers(
  page: number = 1,
  limit: number = 20
): Promise<PaginatedUsers> {
  const db = mongoDb.getDb();

  // Ensure page is at least 1
  const pageNum = Math.max(1, page);
  // Cap limit at MAX_LIMIT and ensure it's at least 1
  const limitNum = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  const [users, total] = await Promise.all([
    db.users.find().skip(skip).limit(limitNum).toArray(),
    db.users.countDocuments(),
  ]);

  return {
    data: users,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

export function getUserById(id: string): Promise<User | null> {
  const db = mongoDb.getDb();
  return db.users.findOne({ _id: new ObjectId(id) });
}

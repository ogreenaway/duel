import { ObjectId } from "mongodb";
import { Program } from "../models/ProgramModel";
import mongoDb from "../database/MongoDb";

const MAX_LIMIT = 10000;

export interface PaginatedPrograms {
  data: Program[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getAllPrograms(
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedPrograms> {
  const db = mongoDb.getDb();

  // Ensure page is at least 1
  const pageNum = Math.max(1, page);
  // Cap limit at MAX_LIMIT and ensure it's at least 1
  const limitNum = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  const [programs, total] = await Promise.all([
    db.programs.find().skip(skip).limit(limitNum).toArray(),
    db.programs.countDocuments(),
  ]);

  return {
    data: programs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

export function getProgramById(id: string): Promise<Program | null> {
  const db = mongoDb.getDb();
  return db.programs.findOne({ _id: new ObjectId(id) });
}

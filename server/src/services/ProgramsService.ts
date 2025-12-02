import { ObjectId } from "mongodb";
import { Program } from "../types/types";
import mongoDb from "../repos/MongoDb";

export function getAllPrograms(): Promise<Program[]> {
  const db = mongoDb.getDb();
  return db.programs.find().toArray();
}

export function getProgramById(id: string): Promise<Program | null> {
  const db = mongoDb.getDb();
  return db.programs.findOne({ _id: new ObjectId(id) });
}

import { Filter, ObjectId } from "mongodb";

import { Task } from "../types/types";
import mongoDb from "../repos/MongoDb";

export function getAllTasks(): Promise<Task[]> {
  const db = mongoDb.getDb();
  return db.tasks.find().toArray();
}

export function getTaskById(id: string): Promise<Task | null> {
  const db = mongoDb.getDb();
  console.log("ID:", id);
  return db.tasks.findOne({ _id: new ObjectId(id) });
}

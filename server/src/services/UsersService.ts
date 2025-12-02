import { ObjectId } from "mongodb";
import { User } from "../types/types";
import mongoDb from "../repos/MongoDb";

export function getAllUsers(): Promise<User[]> {
  const db = mongoDb.getDb();
  return db.users.find().toArray();
}

export function getUserById(id: string): Promise<User | null> {
  const db = mongoDb.getDb();
  return db.users.findOne({ _id: new ObjectId(id) });
}

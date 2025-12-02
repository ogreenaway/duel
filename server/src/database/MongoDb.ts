import { Collection, Db, MongoClient } from "mongodb";

import ENV from "@src/common/constants/ENV";
import { Program } from "@src/models/ProgramModel";
import { Task } from "@src/models/TaskModel";
import { User } from "@src/models/UserModel";

interface Database {
  tasks: Collection<Task>;
  programs: Collection<Program>;
  users: Collection<User>;
}

let client: MongoClient;
let db: Db;

async function connect(): Promise<void> {
  if (client) {
    return; // Already connected
  }

  client = new MongoClient(ENV.MongodbUri);
  await client.connect();
  db = client.db("duel");
}

function getDb(): Database {
  if (!db) {
    throw new Error("Database not initialized. Call connect() first.");
  }

  return {
    users: db.collection<User>("users"),
    tasks: db.collection<Task>("tasks"),
    programs: db.collection<Program>("programs"),
  };
}

async function close(): Promise<void> {
  if (client) {
    await client.close();
  }
}

export default {
  connect,
  getDb,
  close,
} as const;

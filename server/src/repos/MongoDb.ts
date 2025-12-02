import { Collection, Db, MongoClient } from "mongodb";

import ENV from "@src/common/constants/ENV";
import { IUser } from "@src/models/User";
import { NodeEnvs } from "@src/common/constants";
import { Task } from "@src/types/types";

/******************************************************************************
                                Constants
******************************************************************************/

const DB_NAME = ENV.NodeEnv === NodeEnvs.Test ? "duel-test" : "duel";

/******************************************************************************
                                Types
******************************************************************************/

interface IDb {
  users: Collection<IUser>;
  tasks: Collection<Task>;
}

/******************************************************************************
                                Variables
******************************************************************************/

let client: MongoClient;
let db: Db;

/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Connect to MongoDB
 */
async function connect(): Promise<void> {
  if (client) {
    return; // Already connected
  }

  client = new MongoClient(ENV.MongodbUri);
  await client.connect();
  db = client.db(DB_NAME);
}

/**
 * Get the database instance
 */
function getDb(): IDb {
  if (!db) {
    throw new Error("Database not initialized. Call connect() first.");
  }

  return {
    users: db.collection<IUser>("users"),
    tasks: db.collection<Task>("tasks"),
  };
}

/**
 * Close the database connection
 */
async function close(): Promise<void> {
  if (client) {
    await client.close();
  }
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  connect,
  getDb,
  close,
} as const;

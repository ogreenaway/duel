import { IUser } from '@src/models/User';
import { getRandomInt } from '@src/common/util/misc';

import mongoDb from './MongoDb';


/******************************************************************************
                                Functions
******************************************************************************/

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  const db = mongoDb.getDb();
  return db.users.findOne({ email });
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const db = mongoDb.getDb();
  const user = await db.users.findOne({ id });
  return !!user;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  const db = mongoDb.getDb();
  return db.users.find().toArray();
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  const db = mongoDb.getDb();
  user.id = getRandomInt();
  await db.users.insertOne(user);
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  const db = mongoDb.getDb();
  await db.users.updateOne(
    { id: user.id },
    { 
      $set: { 
        name: user.name, 
        email: user.email 
      } 
    }
  );
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  const db = mongoDb.getDb();
  await db.users.deleteOne({ id });
}


// **** Unit-Tests Only **** //

/**
 * Delete every user record.
 */
async function deleteAllUsers(): Promise<void> {
  const db = mongoDb.getDb();
  await db.users.deleteMany({});
}

/**
 * Insert multiple users.
 */
async function insertMult(
  users: IUser[] | readonly IUser[],
): Promise<IUser[]> {
  const db = mongoDb.getDb();
  const usersF = [ ...users ];
  for (const user of usersF) {
    user.id = getRandomInt();
    user.created = new Date();
  }
  await db.users.insertMany(usersF);
  return usersF;
}


/******************************************************************************
                                Export default
******************************************************************************/

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  deleteAllUsers,
  insertMult,
} as const;

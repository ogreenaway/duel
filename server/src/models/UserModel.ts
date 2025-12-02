import { ObjectId } from "mongodb";
import { Program } from "./ProgramModel";

export type User = {
  legacy_user_id: unknown;
  _id: ObjectId;
  name: string | null;
  email: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  joined_at: string | null;
  advocacy_programs: Program[];
};

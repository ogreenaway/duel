import { User } from "../../models/UserModel";
import { getCleanEmail } from "./getCleanEmail";
import { getCleanInstagramHandle } from "./getCleanInstagramHandle";
import { getCleanJoinedAt } from "./getCleanJoinedAt";
import { getCleanName } from "./getCleanName";
import { getCleanTiktokHandle } from "./getCleanTiktokHandle";

export const getCleanUser = (
  user: any,
): Omit<User, "_id" | "advocacy_programs"> => {
  return {
    legacy_user_id: user.user_id,
    name: getCleanName(user.name),
    email: getCleanEmail(user.email),
    instagram_handle: getCleanInstagramHandle(user.instagram_handle),
    tiktok_handle: getCleanTiktokHandle(user.tiktok_handle),
    joined_at: getCleanJoinedAt(user.joined_at),
  };
};

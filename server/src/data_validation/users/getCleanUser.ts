import { User } from "../../types/types";
import { getCleanUserId } from "./getCleanUserId";
import { getCleanName } from "./getCleanName";
import { getCleanEmail } from "./getCleanEmail";
import { getCleanInstagramHandle } from "./getCleanInstagramHandle";
import { getCleanTiktokHandle } from "./getCleanTiktokHandle";
import { getCleanJoinedAt } from "./getCleanJoinedAt";
import { getCleanAdvocacyProgram } from "../programs/getCleanAdvocacyProgram";

export const getCleanUser = (user: any): User => {
    return {
        user_id: getCleanUserId(user.user_id),
        name: getCleanName(user.name),
        email: getCleanEmail(user.email),
        instagram_handle: getCleanInstagramHandle(user.instagram_handle),
        tiktok_handle: getCleanTiktokHandle(user.tiktok_handle),
        joined_at: getCleanJoinedAt(user.joined_at),
        advocacy_programs: getCleanAdvocacyProgram(user.advocacy_programs)
    };
};
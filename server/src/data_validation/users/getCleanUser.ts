import type { User } from "../../types/types";

export const getCleanUser = (user: any):User => {
    return {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        instagram_handle: user.instagram_handle,
        tiktok_handle: user.tiktok_handle,
        joined_at: user.joined_at,
        advocacy_programs: user.advocacy_programs || []
    }
}
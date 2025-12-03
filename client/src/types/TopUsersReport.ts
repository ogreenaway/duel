import { User } from "./UserModel";

export type SortBy = "likes" | "comments" | "shares";

export type Platform = "TikTok" | "Instagram" | "Facebook";

export interface UserReportStats {
  user: User;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalReach: number;
}


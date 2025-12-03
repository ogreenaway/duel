export type Platform = "TikTok" | "Instagram" | "Facebook";

export type Task = {
  _id: string;
  legacy_task_id: string;
  user_id: string;
  program_id: string;
  platform: Platform | null;
  post_url: string | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  reach: number | null;
};

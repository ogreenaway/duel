import { ObjectId } from "mongodb";

export type Platform = "TikTok" | "Instagram" | "Facebook";

export type Task = {
  _id: ObjectId;
  legacy_task_id: string;
  user_id: string;
  program_id: ObjectId;
  platform: Platform | null;
  post_url: string | null;
  likes: number | null;
  comments: number | null;
  shares: number | null;
  reach: number | null;
};

export type TaskWithSales = Task & {
  total_sales_attributed: number | null;
};

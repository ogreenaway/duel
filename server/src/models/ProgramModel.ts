import { ObjectId } from "mongodb";
import { Task } from "./TaskModel";

export type Program = {
  _id: ObjectId;
  user_id: string;
  legacy_program_id: string;
  brand: string | null;
  total_sales_attributed: number | null;
  tasks_completed: Task[];
};

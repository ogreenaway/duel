import { Task } from "../../models/TaskModel";
import { getCleanPlatform } from "./getCleanPlatform";
import { getCleanPositiveInteger } from "../common/getCleanPositiveInteger";
import { getCleanPostUrl } from "./getCleanPostUrl";

export const getCleanTasksCompletes = (
  task: any,
): Omit<Task, "_id" | "user_id" | "program_id"> => {
  return {
    legacy_task_id: task.task_id,
    platform: getCleanPlatform(task.platform),
    post_url: getCleanPostUrl(task.post_url),
    likes: getCleanPositiveInteger(task.likes),
    comments: getCleanPositiveInteger(task.comments),
    shares: getCleanPositiveInteger(task.shares),
    reach: getCleanPositiveInteger(task.reach),
  };
};

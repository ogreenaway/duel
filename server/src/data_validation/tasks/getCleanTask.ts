import { Task } from "../../models/UserModel";
import { getCleanComments } from "./getCleanComments";
import { getCleanLikes } from "./getCleanLikes";
import { getCleanPlatform } from "./getCleanPlatform";
import { getCleanPostUrl } from "./getCleanPostUrl";
import { getCleanReach } from "./getCleanReach";
import { getCleanShares } from "./getCleanShares";

export const getCleanTasksCompletes = (
  task: any
): Omit<Task, "_id" | "user_id" | "platform_id"> => {
  return {
    legacy_task_id: task.task_id,
    platform: getCleanPlatform(task.platform),
    post_url: getCleanPostUrl(task.post_url),
    likes: getCleanLikes(task.likes),
    comments: getCleanComments(task.comments),
    shares: getCleanShares(task.shares),
    reach: getCleanReach(task.reach),
  };
};

import { Task } from "../../types/types";
import { getCleanPlatform } from "./getCleanPlatform";
import { getCleanPostUrl } from "./getCleanPostUrl";
import { getCleanLikes } from "./getCleanLikes";
import { getCleanComments } from "./getCleanComments";
import { getCleanShares } from "./getCleanShares";
import { getCleanReach } from "./getCleanReach";

export const getCleanTasksCompletes = (task: any): Omit<Task, "_id" | "user_id" | "platform_id"> => {
    return {
        legacy_task_id: task.task_id,
        platform: getCleanPlatform(task.platform),
        post_url: getCleanPostUrl(task.post_url),
        likes: getCleanLikes(task.likes),
        comments: getCleanComments(task.comments),
        shares: getCleanShares(task.shares),
        reach: getCleanReach(task.reach)
    };
};
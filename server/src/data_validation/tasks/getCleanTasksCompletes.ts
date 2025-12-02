import { Task } from "../../types/types";
import { getCleanTaskId } from "./getCleanTaskId";
import { getCleanPlatform } from "./getCleanPlatform";
import { getCleanPostUrl } from "./getCleanPostUrl";
import { getCleanLikes } from "./getCleanLikes";
import { getCleanComments } from "./getCleanComments";
import { getCleanShares } from "./getCleanShares";
import { getCleanReach } from "./getCleanReach";

export const getCleanTasksCompletes = (tasks: unknown): Task[] => {
    if (!Array.isArray(tasks)) {
        return [];
    }

    return tasks.map((task: any) => ({
        task_id: getCleanTaskId(task.task_id),
        platform: getCleanPlatform(task.platform),
        post_url: getCleanPostUrl(task.post_url),
        likes: getCleanLikes(task.likes),
        comments: getCleanComments(task.comments),
        shares: getCleanShares(task.shares),
        reach: getCleanReach(task.reach)
    }));
};
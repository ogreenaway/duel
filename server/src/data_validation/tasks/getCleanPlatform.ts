import { Platform } from "../../models/TaskModel";

export const getCleanPlatform = (platform: unknown): Platform | null => {
  if (
    platform === "TikTok" ||
    platform === "Instagram" ||
    platform === "Facebook"
  ) {
    return platform;
  }
  return null;
};

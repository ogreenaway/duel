import { Request, Response, Router } from "express";
import {
  SortBy,
  TopUsersReportParams,
  getTopUsersReport,
} from "../services/TopUsersReportService";

import { Platform } from "../models/TaskModel";

const router = Router();

/**
 * GET /reports/users/top
 * Get top users report with various sorting and filtering options
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - sortBy: 'likes' | 'comments' | 'shares' | 'reach' (default: 'likes')
 * - platform: 'TikTok' | 'Instagram' | 'Facebook' (optional)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // Extract and parse query parameters
    const page = req.query.page
      ? parseInt(req.query.page as string)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;
    const sortBy = (req.query.sortBy as SortBy) || "likes";
    const platform = req.query.platform
      ? (req.query.platform as Platform)
      : undefined;

    // Validate sortBy
    const validSortBy: SortBy[] = ["likes", "comments", "shares", "reach"];
    if (sortBy && !validSortBy.includes(sortBy)) {
      return res.status(400).json({
        error: `Invalid sortBy parameter. Must be one of: ${validSortBy.join(
          ", ",
        )}`,
      });
    }

    // Validate platform if provided
    if (platform) {
      const validPlatforms: Platform[] = ["TikTok", "Instagram", "Facebook"];
      if (!validPlatforms.includes(platform)) {
        return res.status(400).json({
          error: `Invalid platform parameter. Must be one of: ${validPlatforms.join(
            ", ",
          )}`,
        });
      }
    }

    // Build params object
    const params: TopUsersReportParams = {
      ...(page !== undefined && { page }),
      ...(limit !== undefined && { limit }),
      ...(sortBy && { sortBy }),
      ...(platform && { platform }),
    };

    // Get the report
    const result = await getTopUsersReport(params);

    return res.json(result);
  } catch (error) {
    console.error("Error in top users report:", error);
    return res.status(500).json({
      error: "Internal server error while generating top users report",
    });
  }
});

export default router;

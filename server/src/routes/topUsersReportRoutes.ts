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
 * - sortBy: 'likes' | 'comments' | 'shares' | 'conversion' | 'composite' (default: 'composite')
 * - likeWeight: number (default: 0.2)
 * - commentWeight: number (default: 0.2)
 * - shareWeight: number (default: 0.2)
 * - reachWeight: number (default: 0.4)
 * - conversionWeight: number (default: 0.3)
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
    const sortBy = (req.query.sortBy as SortBy) || "composite";
    const likeWeight = req.query.likeWeight
      ? parseFloat(req.query.likeWeight as string)
      : undefined;
    const commentWeight = req.query.commentWeight
      ? parseFloat(req.query.commentWeight as string)
      : undefined;
    const shareWeight = req.query.shareWeight
      ? parseFloat(req.query.shareWeight as string)
      : undefined;
    const reachWeight = req.query.reachWeight
      ? parseFloat(req.query.reachWeight as string)
      : undefined;
    const conversionWeight = req.query.conversionWeight
      ? parseFloat(req.query.conversionWeight as string)
      : undefined;
    const platform = req.query.platform
      ? (req.query.platform as Platform)
      : undefined;

    // Validate sortBy
    const validSortBy: SortBy[] = [
      "likes",
      "comments",
      "shares",
      "conversion",
      "composite",
    ];
    if (sortBy && !validSortBy.includes(sortBy)) {
      return res.status(400).json({
        error: `Invalid sortBy parameter. Must be one of: ${validSortBy.join(
          ", "
        )}`,
      });
    }

    // Validate platform if provided
    if (platform) {
      const validPlatforms: Platform[] = ["TikTok", "Instagram", "Facebook"];
      if (!validPlatforms.includes(platform)) {
        return res.status(400).json({
          error: `Invalid platform parameter. Must be one of: ${validPlatforms.join(
            ", "
          )}`,
        });
      }
    }

    // Build params object
    const params: TopUsersReportParams = {
      ...(page !== undefined && { page }),
      ...(limit !== undefined && { limit }),
      ...(sortBy && { sortBy }),
      ...(likeWeight !== undefined && { likeWeight }),
      ...(commentWeight !== undefined && { commentWeight }),
      ...(shareWeight !== undefined && { shareWeight }),
      ...(reachWeight !== undefined && { reachWeight }),
      ...(conversionWeight !== undefined && { conversionWeight }),
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

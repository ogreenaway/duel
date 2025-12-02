import { Request, Response, Router } from "express";

import { getPaginationParams } from "../common/util/pagination";
import { getTopProgramsBySales } from "../services/TopProgramReportService";

const router = Router();

/**
 * GET /reports/programs/top
 * Get top programs by total_sales_attributed
 * Returns paginated list of programs sorted by highest sales
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const result = await getTopProgramsBySales(page, limit);

    return res.json(result);
  } catch (error) {
    console.error("Error in top programs report:", error);
    return res.status(500).json({
      error: "Internal server error while generating top programs report",
    });
  }
});

export default router;

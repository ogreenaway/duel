import { Request, Response, Router } from "express";

import { getOutliersReport } from "../services/OutliersReportService";

const router = Router();

/**
 * GET /reports/outliers
 * Get outliers report with task metrics and program sales
 * Returns first 100 tasks with their engagement metrics (reach, shares, likes, comments)
 * and the total_sales_attributed from the linked program
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await getOutliersReport();

    return res.json(result);
  } catch (error) {
    console.error("Error in outliers report:", error);
    return res.status(500).json({
      error: "Internal server error while generating outliers report",
    });
  }
});

export default router;


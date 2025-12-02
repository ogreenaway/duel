import { Request, Response, Router } from "express";
import { getMirrorUserById, getMirrorUsers } from "../services/MirrorService";

import { getPaginationParams } from "../common/util/pagination";

const router = Router();

/**
 * GET /mirror
 * Get paginated list of users with nested programs and tasks
 *
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { page, limit } = getPaginationParams(req);
    const result = await getMirrorUsers(page, limit);

    return res.json(result);
  } catch (error) {
    console.error("Error in mirror users:", error);
    return res.status(500).json({
      error: "Internal server error while fetching mirror users",
    });
  }
});

/**
 * GET /mirror/:id
 * Get a single user with nested programs and tasks by user_id
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await getMirrorUserById(userId);

    if (!result) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.json(result);
  } catch (error) {
    console.error("Error in mirror user by id:", error);
    return res.status(500).json({
      error: "Internal server error while fetching mirror user",
    });
  }
});

export default router;

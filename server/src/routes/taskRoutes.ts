import { Request, Response, Router } from "express";
import { getAllTasks, getTaskById } from "../services/TasksService";

import { getPaginationParams } from "../common/util/pagination";

const router = Router();

/**
 * GET /tasks
 * Get all tasks with pagination
 */
router.get("/", async (req: Request, res: Response) => {
  const { page, limit } = getPaginationParams(req);
  const result = await getAllTasks(page, limit);
  return res.json(result);
});

/**
 * GET /tasks/:id
 * Get a single task by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  const task = await getTaskById(req.params.id);
  return res.json(task);
});

export default router;

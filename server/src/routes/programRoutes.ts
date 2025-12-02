import { Request, Response, Router } from "express";
import { getAllPrograms, getProgramById } from "../services/ProgramsService";

import { getPaginationParams } from "../common/util/pagination";

const router = Router();

/**
 * GET /programs
 * Get all programs with pagination
 */
router.get("/", async (req: Request, res: Response) => {
  const { page, limit } = getPaginationParams(req);
  const result = await getAllPrograms(page, limit);
  return res.json(result);
});

/**
 * GET /programs/:id
 * Get a single program by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  const program = await getProgramById(req.params.id);
  return res.json(program);
});

export default router;

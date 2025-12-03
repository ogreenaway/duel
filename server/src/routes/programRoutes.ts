import { Request, Response, Router } from "express";
import { getAllPrograms, getProgramById } from "../services/ProgramsService";

import { ObjectId } from "mongodb";
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
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  const program = await getProgramById(req.params.id);
  if (!program) {
    return res.status(404).json({ error: "Program not found" });
  }
  return res.json(program);
});

export default router;

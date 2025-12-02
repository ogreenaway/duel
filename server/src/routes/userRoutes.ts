import { Request, Response, Router } from "express";
import { getAllUsers, getUserById } from "../services/UsersService";

import { getPaginationParams } from "../common/util/pagination";

const router = Router();

/**
 * GET /users
 * Get all users with pagination
 */
router.get("/", async (req: Request, res: Response) => {
  const { page, limit } = getPaginationParams(req);
  const result = await getAllUsers(page, limit);
  return res.json(result);
});

/**
 * GET /users/:id
 * Get a single user by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id);
  return res.json(user);
});

export default router;

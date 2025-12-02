import { Request } from "express";

/**
 * Extract pagination parameters from request query
 * @param req Express request object
 * @returns Object with page and limit values
 */
export function getPaginationParams(req: Request): { page: number; limit: number } {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  return { page, limit };
}


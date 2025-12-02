import { ObjectId } from "mongodb";
import mongoDb from "../database/MongoDb";

export interface TopProgram {
  _id: ObjectId;
  legacy_program_id: string;
  brand: string | null;
  total_sales_attributed: number;
}

export interface PaginatedTopPrograms {
  data: TopProgram[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const MAX_LIMIT = 100;

/**
 * Get top programs by total_sales_attributed
 * Returns paginated list of programs sorted by highest sales
 */
export async function getTopProgramsBySales(
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedTopPrograms> {
  const db = mongoDb.getDb();

  // Validate pagination
  const pageNum = Math.max(1, page);
  const limitNum = Math.min(Math.max(1, limit), MAX_LIMIT);
  const skip = (pageNum - 1) * limitNum;

  // Aggregate programs, filter valid sales, sort, and paginate
  const result = await db.programs
    .aggregate([
      // Match only programs with valid total_sales_attributed
      {
        $match: {
          total_sales_attributed: {
            $ne: null,
            $type: "number",
          },
        },
      },
      // Sort by total_sales_attributed descending
      { $sort: { total_sales_attributed: -1 } },
      // Get total count and paginated data
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limitNum },
            {
              $project: {
                _id: 1,
                legacy_program_id: 1,
                brand: 1,
                total_sales_attributed: 1,
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ])
    .toArray();

  const data = result[0]?.data || [];
  const total = result[0]?.total[0]?.count || 0;

  return {
    data: data as TopProgram[],
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
}

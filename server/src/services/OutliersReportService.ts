import mongoDb from "../database/MongoDb";
import { sampleCorrelation } from "simple-statistics";

export interface OutlierResponse {
  reachCorrelationCoefficient: number;
  sharesCorrelationCoefficient: number;
  likesCorrelationCoefficient: number;
  commentsCorrelationCoefficient: number;
}

/**
 * Get outliers report with task metrics and program sales
 * Calculates correlation coefficients for reach, shares, likes, and comments
 * against total_sales_attributed
 * Excludes tasks where total_sales_attributed is null
 */
export async function getOutliersReport(): Promise<OutlierResponse> {
  const db = mongoDb.getDb();

  // Aggregate tasks with their linked programs
  const tasks = await db.tasks
    .aggregate([
      // Limit to first 100 tasks
      { $limit: 100 },
      // Lookup the program to get total_sales_attributed
      {
        $lookup: {
          from: "programs",
          localField: "program_id",
          foreignField: "_id",
          as: "program",
        },
      },
      // Unwind the program array (should be 0 or 1 element)
      {
        $unwind: {
          path: "$program",
          preserveNullAndEmptyArrays: true,
        },
      },
      // Filter out tasks where total_sales_attributed is null
      {
        $match: {
          "program.total_sales_attributed": { $ne: null },
        },
      },
      // Project the required fields
      {
        $project: {
          reach: 1,
          shares: 1,
          likes: 1,
          comments: 1,
          total_sales_attributed: "$program.total_sales_attributed",
        },
      },
    ])
    .toArray();

  // Helper function to calculate correlation, filtering out null values
  const calculateCorrelation = (
    metricValues: (number | null)[],
    salesValues: (number | null)[],
  ): number => {
    // Filter to only include pairs where both values are not null
    const pairs: [number, number][] = [];
    for (let i = 0; i < metricValues.length; i++) {
      const metric = metricValues[i];
      const sales = salesValues[i];
      if (metric !== null && sales !== null) {
        pairs.push([metric, sales]);
      }
    }

    // Need at least 2 data points for correlation
    if (pairs.length < 2) {
      return 0;
    }

    const x = pairs.map((pair) => pair[0]);
    const y = pairs.map((pair) => pair[1]);

    return sampleCorrelation(x, y);
  };

  // Extract arrays of values
  const reachValues = tasks.map((t) => t.reach);
  const sharesValues = tasks.map((t) => t.shares);
  const likesValues = tasks.map((t) => t.likes);
  const commentsValues = tasks.map((t) => t.comments);
  const salesValues = tasks.map((t) => t.total_sales_attributed);

  // Calculate correlations
  const reachCorrelationCoefficient = calculateCorrelation(
    reachValues,
    salesValues,
  );
  const sharesCorrelationCoefficient = calculateCorrelation(
    sharesValues,
    salesValues,
  );
  const likesCorrelationCoefficient = calculateCorrelation(
    likesValues,
    salesValues,
  );
  const commentsCorrelationCoefficient = calculateCorrelation(
    commentsValues,
    salesValues,
  );

  return {
    reachCorrelationCoefficient,
    sharesCorrelationCoefficient,
    likesCorrelationCoefficient,
    commentsCorrelationCoefficient,
  };
}

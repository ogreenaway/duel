import * as fs from "fs";
import * as path from "path";

import { getValidJson } from "../../data_validation/getValidJson";

const INITIAL_DATA_DIR = path.join(__dirname, "../../../../initial_data");

interface UserStats {
  fileName: string;
  userId: string | null;
  name: string | null;
  email: string | null;
  totalLikes: number;
  totalReach: number;
  totalSalesAttributed: number;
}

/**
 * Safely parse a number from various formats (handles "NaN", null, etc.)
 */
function parseNumber(value: any): number {
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Check if a value is a valid number
 */
function isValidNumber(value: any): boolean {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

/**
 * Analyze all users and calculate their statistics
 */
async function analyzeTopUsers(): Promise<void> {
  console.log("🔍 Starting analysis of user statistics...\n");

  const userStats: UserStats[] = [];
  let filesProcessed = 0;
  let filesFixed = 0;
  let filesWithErrors = 0;

  // Get all JSON files
  const files = fs
    .readdirSync(INITIAL_DATA_DIR)
    .filter((file) => file.endsWith(".json") && file.startsWith("user_"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  console.log(`📁 Found ${files.length} JSON files to analyze\n`);

  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(INITIAL_DATA_DIR, file);

    try {
      let fileContent = fs.readFileSync(filePath, "utf-8");
      let userData: any;
      let wasFixed = false;

      // Try to parse JSON
      try {
        userData = JSON.parse(fileContent);
      } catch (parseError) {
        // Try to fix malformed JSON
        try {
          const fixedJson = getValidJson(fileContent);
          userData = JSON.parse(fixedJson);
          wasFixed = true;
          filesFixed++;
        } catch (fixError) {
          console.error(
            `❌ Failed to parse ${file}: ${(fixError as Error).message}`
          );
          filesWithErrors++;
          continue;
        }
      }

      // Initialize user stats
      const stats: UserStats = {
        fileName: file,
        userId: userData.user_id || null,
        name: userData.name || null,
        email: userData.email || null,
        totalLikes: 0,
        totalReach: 0,
        totalSalesAttributed: 0,
      };

      // Process all advocacy programs
      const advocacyPrograms = userData.advocacy_programs || [];

      for (const program of advocacyPrograms) {
        // Sum total_sales_attributed (only if it's a valid number)
        if (isValidNumber(program.total_sales_attributed)) {
          stats.totalSalesAttributed += program.total_sales_attributed;
        }

        // Process all tasks in this program
        const tasksCompleted = program.tasks_completed || [];
        for (const task of tasksCompleted) {
          // Sum likes
          stats.totalLikes += parseNumber(task.likes);

          // Sum reach
          stats.totalReach += parseNumber(task.reach);
        }
      }

      userStats.push(stats);
      filesProcessed++;

      // Progress indicator
      if ((i + 1) % 1000 === 0) {
        console.log(`⏳ Processed ${i + 1}/${files.length} files...`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}: ${(error as Error).message}`);
      filesWithErrors++;
    }
  }

  // Sort and get top 10 for each metric
  const topLikes = [...userStats]
    .sort((a, b) => b.totalLikes - a.totalLikes)
    .slice(0, 10);

  const topReach = [...userStats]
    .sort((a, b) => b.totalReach - a.totalReach)
    .slice(0, 10);

  const topSales = [...userStats]
    .filter((user) => user.totalSalesAttributed > 0)
    .sort((a, b) => b.totalSalesAttributed - a.totalSalesAttributed)
    .slice(0, 10);

  // Print results
  console.log("\n" + "=".repeat(80));
  console.log("📊 ANALYSIS RESULTS");
  console.log("=".repeat(80));
  console.log(`Files processed: ${filesProcessed}`);
  console.log(`Files with JSON fixed: ${filesFixed}`);
  console.log(`Files with errors: ${filesWithErrors}`);
  console.log(`Total users analyzed: ${userStats.length}`);

  // Top 10 by Likes
  console.log("\n" + "=".repeat(80));
  console.log("🏆 TOP 10 USERS BY TOTAL LIKES");
  console.log("=".repeat(80));
  topLikes.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.name || "Unknown"} (${user.fileName})`);
    console.log(`   User ID: ${user.userId || "N/A"}`);
    console.log(`   Email: ${user.email || "N/A"}`);
    console.log(`   Total Likes: ${user.totalLikes.toLocaleString()}`);
    console.log(`   Total Reach: ${user.totalReach.toLocaleString()}`);
    console.log(`   Total Sales: $${user.totalSalesAttributed.toFixed(2)}`);
  });

  // Top 10 by Reach
  console.log("\n" + "=".repeat(80));
  console.log("📈 TOP 10 USERS BY TOTAL REACH");
  console.log("=".repeat(80));
  topReach.forEach((user, index) => {
    console.log(`\n${index + 1}. ${user.name || "Unknown"} (${user.fileName})`);
    console.log(`   User ID: ${user.userId || "N/A"}`);
    console.log(`   Email: ${user.email || "N/A"}`);
    console.log(`   Total Reach: ${user.totalReach.toLocaleString()}`);
    console.log(`   Total Likes: ${user.totalLikes.toLocaleString()}`);
    console.log(`   Total Sales: $${user.totalSalesAttributed.toFixed(2)}`);
  });

  // Top 10 by Sales
  console.log("\n" + "=".repeat(80));
  console.log("💰 TOP 10 USERS BY TOTAL SALES ATTRIBUTED");
  console.log("=".repeat(80));
  if (topSales.length > 0) {
    topSales.forEach((user, index) => {
      console.log(
        `\n${index + 1}. ${user.name || "Unknown"} (${user.fileName})`
      );
      console.log(`   User ID: ${user.userId || "N/A"}`);
      console.log(`   Email: ${user.email || "N/A"}`);
      console.log(
        `   Total Sales: $${user.totalSalesAttributed.toLocaleString(
          undefined,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}`
      );
      console.log(`   Total Likes: ${user.totalLikes.toLocaleString()}`);
      console.log(`   Total Reach: ${user.totalReach.toLocaleString()}`);
    });
  } else {
    console.log(
      "\n⚠️  No users found with valid total_sales_attributed values"
    );
  }

  // Summary statistics
  console.log("\n" + "=".repeat(80));
  console.log("📈 SUMMARY STATISTICS");
  console.log("=".repeat(80));
  const totalLikes = userStats.reduce((sum, user) => sum + user.totalLikes, 0);
  const totalReach = userStats.reduce((sum, user) => sum + user.totalReach, 0);
  const totalSales = userStats.reduce(
    (sum, user) => sum + user.totalSalesAttributed,
    0
  );
  const usersWithSales = userStats.filter(
    (user) => user.totalSalesAttributed > 0
  ).length;

  console.log(`\nTotal Likes (all users): ${totalLikes.toLocaleString()}`);
  console.log(`Total Reach (all users): ${totalReach.toLocaleString()}`);
  console.log(
    `Total Sales (all users): $${totalSales.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  );
  console.log(
    `Users with sales data: ${usersWithSales} out of ${userStats.length}`
  );

  console.log("\n" + "=".repeat(80));
  console.log("✅ Analysis complete!");
  console.log("=".repeat(80) + "\n");
}

// Run the analysis
analyzeTopUsers().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

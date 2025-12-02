import * as fs from "fs";
import * as path from "path";

import { getValidJson } from "../../data_validation/getValidJson";

const INITIAL_DATA_DIR = path.join(__dirname, "../../../../initial_data");

/**
 * Check all JSON files for duplicate user_ids
 */
async function checkDuplicateUserIds(): Promise<void> {
  console.log("🔍 Checking for duplicate user_ids across all JSON files...\n");

  let totalFiles = 0;
  let filesProcessed = 0;
  let filesFixed = 0;
  let filesWithErrors = 0;
  let filesWithNullUserId = 0;
  let filesIgnored = 0;

  // Map to track user_id -> array of file names (only non-null user_ids)
  const userIdMap = new Map<string, string[]>();

  // Get all JSON files
  const files = fs
    .readdirSync(INITIAL_DATA_DIR)
    .filter((file) => file.endsWith(".json") && file.startsWith("user_"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  totalFiles = files.length;
  console.log(`📁 Found ${totalFiles} JSON files to analyze\n`);

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

      // Extract user_id
      const userId = userData.user_id ?? null;

      // Skip files with null user_id
      if (userId === null) {
        filesWithNullUserId++;
        filesIgnored++;
        continue;
      }

      // Track user_id (only non-null)
      if (!userIdMap.has(userId)) {
        userIdMap.set(userId, []);
      }
      userIdMap.get(userId)!.push(file);

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

  // Find duplicates (user_ids that appear in more than one file)
  const duplicateUserIds: Array<{ userId: string; files: string[] }> = [];
  const uniqueUserIds: string[] = [];

  userIdMap.forEach((fileList, userId) => {
    if (fileList.length > 1) {
      duplicateUserIds.push({
        userId,
        files: fileList,
      });
    } else {
      uniqueUserIds.push(userId);
    }
  });

  // Print results
  console.log("\n" + "=".repeat(80));
  console.log("📊 ANALYSIS RESULTS");
  console.log("=".repeat(80));
  console.log(`Total files found: ${totalFiles}`);
  console.log(`Files successfully processed: ${filesProcessed}`);
  console.log(`Files with JSON fixed: ${filesFixed}`);
  console.log(`Files with errors: ${filesWithErrors}`);
  console.log(`Files ignored (null user_id): ${filesIgnored}`);
  console.log(`\nTotal unique user_ids: ${uniqueUserIds.length}`);
  console.log(
    `User_ids with duplicates (appear in multiple files): ${duplicateUserIds.length}`
  );

  // Calculate total files involved in duplicates
  const totalFilesInDuplicates = duplicateUserIds.reduce(
    (sum, dup) => sum + dup.files.length,
    0
  );
  console.log(`Total files involved in duplicates: ${totalFilesInDuplicates}`);

  // Show duplicates
  if (duplicateUserIds.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("🔴 DUPLICATE USER_IDS (appearing in multiple files):");
    console.log("-".repeat(80));

    // Sort by number of occurrences (most duplicates first)
    duplicateUserIds.sort((a, b) => b.files.length - a.files.length);

    duplicateUserIds.forEach((dup, idx) => {
      console.log(
        `\n${idx + 1}. User ID: "${dup.userId}" (appears in ${
          dup.files.length
        } file(s))`
      );
      console.log(`   Files:`);
      dup.files.forEach((fileName, fileIdx) => {
        console.log(`     ${fileIdx + 1}. ${fileName}`);
      });
    });

    // Show distribution
    console.log("\n" + "-".repeat(80));
    console.log("📈 DISTRIBUTION OF DUPLICATES:");
    console.log("-".repeat(80));
    const distribution = new Map<number, number>();
    duplicateUserIds.forEach((dup) => {
      const count = dup.files.length;
      const existing = distribution.get(count) || 0;
      distribution.set(count, existing + 1);
    });

    Array.from(distribution.entries())
      .sort((a, b) => b[0] - a[0])
      .forEach(([fileCount, userIdCount]) => {
        console.log(
          `  User_ids appearing in ${fileCount} file(s): ${userIdCount} user_id(s)`
        );
      });
  } else {
    console.log("\n✅ No duplicate user_ids found! All user_ids are unique.");
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ Analysis complete!");
  console.log("=".repeat(80) + "\n");
}

// Run the analysis
checkDuplicateUserIds().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

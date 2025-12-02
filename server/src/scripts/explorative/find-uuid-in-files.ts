import * as fs from "fs";
import * as path from "path";

import { getValidJson } from "../../data_validation/getValidJson";

const INITIAL_DATA_DIR = path.join(__dirname, "../../../../initial_data");
const SEARCH_STRING = "fbf0216b-7139-4a9d-9259-8f08f0256b05";

/**
 * Find all JSON files containing a specific UUID string
 */
async function findUuidInFiles(): Promise<void> {
  console.log(`🔍 Searching for "${SEARCH_STRING}" in all JSON files...\n`);

  let totalFiles = 0;
  let filesProcessed = 0;
  let filesFixed = 0;
  let filesWithErrors = 0;
  const filesContainingUuid: string[] = [];

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
  console.log(`📁 Found ${totalFiles} JSON files to search\n`);

  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(INITIAL_DATA_DIR, file);

    try {
      let fileContent = fs.readFileSync(filePath, "utf-8");

      // First, check if the string exists in the raw file content (fast check)
      if (!fileContent.includes(SEARCH_STRING)) {
        filesProcessed++;
        continue;
      }

      // If found in raw content, parse JSON to verify and get context
      let userData: any;
      let wasFixed = false;

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
          // Even if parsing fails, if the string is in the file, include it
          filesContainingUuid.push(file);
          filesProcessed++;
          continue;
        }
      }

      // Search in parsed JSON (recursive search)
      const found = searchInObject(userData, SEARCH_STRING);
      if (found) {
        filesContainingUuid.push(file);
      }

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

  // Print results
  console.log("\n" + "=".repeat(80));
  console.log("📊 SEARCH RESULTS");
  console.log("=".repeat(80));
  console.log(`Search string: "${SEARCH_STRING}"`);
  console.log(`Total files searched: ${totalFiles}`);
  console.log(`Files successfully processed: ${filesProcessed}`);
  console.log(`Files with JSON fixed: ${filesFixed}`);
  console.log(`Files with errors: ${filesWithErrors}`);
  console.log(`\n✅ Files containing the UUID: ${filesContainingUuid.length}`);

  if (filesContainingUuid.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("📋 FILES CONTAINING THE UUID:");
    console.log("-".repeat(80));
    filesContainingUuid.forEach((fileName, idx) => {
      console.log(`  ${idx + 1}. ${fileName}`);
    });
  } else {
    console.log("\n❌ No files found containing the UUID.");
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ Search complete!");
  console.log("=".repeat(80) + "\n");
}

/**
 * Recursively search for a string in an object
 */
function searchInObject(obj: any, searchString: string): boolean {
  if (obj === null || obj === undefined) {
    return false;
  }

  // Check if it's a string and contains the search string
  if (typeof obj === "string" && obj.includes(searchString)) {
    return true;
  }

  // Check if it's an array
  if (Array.isArray(obj)) {
    return obj.some((item) => searchInObject(item, searchString));
  }

  // Check if it's an object
  if (typeof obj === "object") {
    return Object.values(obj).some((value) =>
      searchInObject(value, searchString),
    );
  }

  return false;
}

// Run the search
findUuidInFiles().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

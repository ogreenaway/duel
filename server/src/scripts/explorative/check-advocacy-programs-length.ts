import * as fs from "fs";
import * as path from "path";

import { getValidJson } from "../../data_validation/getValidJson";

const INITIAL_DATA_DIR = path.join(__dirname, "../../../../initial_data");

interface FileWithProgramCount {
  fileName: string;
  programCount: number;
  hasAdvocacyPrograms: boolean;
}

/**
 * Check all JSON files for advocacy_programs array length
 */
async function checkAdvocacyProgramsLength(): Promise<void> {
  console.log("🔍 Checking advocacy_programs length in all JSON files...\n");

  let totalFiles = 0;
  let filesProcessed = 0;
  let filesFixed = 0;
  let filesWithErrors = 0;
  let filesWithOneProgram = 0;
  let filesWithMultiplePrograms: FileWithProgramCount[] = [];
  let filesWithZeroPrograms: FileWithProgramCount[] = [];
  let filesWithMissingField: FileWithProgramCount[] = [];

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
            `❌ Failed to parse ${file}: ${(fixError as Error).message}`,
          );
          filesWithErrors++;
          continue;
        }
      }

      // Check advocacy_programs
      const advocacyPrograms = userData.advocacy_programs;

      if (advocacyPrograms === undefined || advocacyPrograms === null) {
        filesWithMissingField.push({
          fileName: file,
          programCount: 0,
          hasAdvocacyPrograms: false,
        });
      } else if (!Array.isArray(advocacyPrograms)) {
        console.warn(
          `⚠️  ${file}: advocacy_programs is not an array (type: ${typeof advocacyPrograms})`,
        );
        filesWithErrors++;
      } else {
        const programCount = advocacyPrograms.length;

        if (programCount === 0) {
          filesWithZeroPrograms.push({
            fileName: file,
            programCount: 0,
            hasAdvocacyPrograms: true,
          });
        } else if (programCount === 1) {
          filesWithOneProgram++;
        } else {
          filesWithMultiplePrograms.push({
            fileName: file,
            programCount,
            hasAdvocacyPrograms: true,
          });
        }
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
  console.log("📊 ANALYSIS RESULTS");
  console.log("=".repeat(80));
  console.log(`Total files found: ${totalFiles}`);
  console.log(`Files successfully processed: ${filesProcessed}`);
  console.log(`Files with JSON fixed: ${filesFixed}`);
  console.log(`Files with errors: ${filesWithErrors}`);
  console.log(`\nFiles with exactly 1 program: ${filesWithOneProgram}`);
  console.log(`Files with 0 programs: ${filesWithZeroPrograms.length}`);
  console.log(
    `Files with multiple programs (>1): ${filesWithMultiplePrograms.length}`,
  );
  console.log(
    `Files with missing advocacy_programs field: ${filesWithMissingField.length}`,
  );

  const filesNotEqualToOne =
    filesWithZeroPrograms.length +
    filesWithMultiplePrograms.length +
    filesWithMissingField.length;

  console.log(
    `\n📌 Total files where advocacy_programs.length !== 1: ${filesNotEqualToOne}`,
  );

  // Show examples
  if (filesWithZeroPrograms.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("📋 FILES WITH 0 PROGRAMS (first 10):");
    console.log("-".repeat(80));
    filesWithZeroPrograms.slice(0, 10).forEach((file, idx) => {
      console.log(`  ${idx + 1}. ${file.fileName}`);
    });
    if (filesWithZeroPrograms.length > 10) {
      console.log(
        `  ... and ${filesWithZeroPrograms.length - 10} more file(s)`,
      );
    }
  }

  if (filesWithMultiplePrograms.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("📋 FILES WITH MULTIPLE PROGRAMS (first 10):");
    console.log("-".repeat(80));
    filesWithMultiplePrograms.slice(0, 10).forEach((file, idx) => {
      console.log(
        `  ${idx + 1}. ${file.fileName} - ${file.programCount} program(s)`,
      );
    });
    if (filesWithMultiplePrograms.length > 10) {
      console.log(
        `  ... and ${filesWithMultiplePrograms.length - 10} more file(s)`,
      );
    }

    // Show distribution of program counts
    const countDistribution = new Map<number, number>();
    filesWithMultiplePrograms.forEach((file) => {
      const count = countDistribution.get(file.programCount) || 0;
      countDistribution.set(file.programCount, count + 1);
    });

    console.log("\n  Program count distribution:");
    Array.from(countDistribution.entries())
      .sort((a, b) => b[0] - a[0])
      .forEach(([count, fileCount]) => {
        console.log(`    ${count} program(s): ${fileCount} file(s)`);
      });
  }

  if (filesWithMissingField.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("📋 FILES WITH MISSING advocacy_programs FIELD (first 10):");
    console.log("-".repeat(80));
    filesWithMissingField.slice(0, 10).forEach((file, idx) => {
      console.log(`  ${idx + 1}. ${file.fileName}`);
    });
    if (filesWithMissingField.length > 10) {
      console.log(
        `  ... and ${filesWithMissingField.length - 10} more file(s)`,
      );
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log("✅ Analysis complete!");
  console.log("=".repeat(80) + "\n");
}

// Run the analysis
checkAdvocacyProgramsLength().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

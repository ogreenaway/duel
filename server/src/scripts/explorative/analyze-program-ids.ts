import * as fs from "fs";
import * as path from "path";

import { getValidJson } from "../../data_validation/getValidJson";

const INITIAL_DATA_DIR = path.join(__dirname, "../../../../initial_data");

interface ProgramIdInfo {
  programId: string;
  fileName: string;
  userIndex: number;
  programIndex: number;
}

interface AnalysisResult {
  totalFiles: number;
  filesProcessed: number;
  filesFixed: number;
  filesWithErrors: number;
  programIdMap: Map<string, ProgramIdInfo[]>;
  duplicateProgramIds: Map<string, ProgramIdInfo[]>;
  examples: {
    duplicateWithinFile: Array<{ fileName: string; programIds: string[] }>;
    duplicateAcrossFiles: Array<{ programId: string; files: string[] }>;
  };
}

/**
 * Analyze all JSON files for matching program_ids
 */
async function analyzeProgramIds(): Promise<void> {
  console.log("🔍 Starting analysis of JSON files...\n");

  const result: AnalysisResult = {
    totalFiles: 0,
    filesProcessed: 0,
    filesFixed: 0,
    filesWithErrors: 0,
    programIdMap: new Map(),
    duplicateProgramIds: new Map(),
    examples: {
      duplicateWithinFile: [],
      duplicateAcrossFiles: [],
    },
  };

  // Get all JSON files
  const files = fs
    .readdirSync(INITIAL_DATA_DIR)
    .filter((file) => file.endsWith(".json") && file.startsWith("user_"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || "0");
      const numB = parseInt(b.match(/\d+/)?.[0] || "0");
      return numA - numB;
    });

  result.totalFiles = files.length;
  console.log(`📁 Found ${result.totalFiles} JSON files to analyze\n`);

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
          result.filesFixed++;
        } catch (fixError) {
          console.error(
            `❌ Failed to parse ${file}: ${(fixError as Error).message}`,
          );
          result.filesWithErrors++;
          continue;
        }
      }

      // Extract program_ids from this file
      const programIdsInFile = new Map<string, number>(); // programId -> count
      const advocacyPrograms = userData.advocacy_programs || [];

      advocacyPrograms.forEach((program: any, programIndex: number) => {
        const programId = program?.program_id || "";

        if (programId && programId.trim() !== "") {
          // Track within-file duplicates
          const count = programIdsInFile.get(programId) || 0;
          programIdsInFile.set(programId, count + 1);

          // Track across all files
          if (!result.programIdMap.has(programId)) {
            result.programIdMap.set(programId, []);
          }

          result.programIdMap.get(programId)!.push({
            programId,
            fileName: file,
            userIndex: i,
            programIndex,
          });
        }
      });

      // Check for duplicates within this file
      programIdsInFile.forEach((count, programId) => {
        if (count > 1) {
          const occurrences =
            result.programIdMap
              .get(programId)
              ?.filter((info) => info.fileName === file) || [];

          if (!result.duplicateProgramIds.has(programId)) {
            result.duplicateProgramIds.set(programId, []);
          }

          occurrences.forEach((occ) => {
            result.duplicateProgramIds.get(programId)!.push(occ);
          });

          // Add to examples (limit to first 10)
          if (result.examples.duplicateWithinFile.length < 10) {
            result.examples.duplicateWithinFile.push({
              fileName: file,
              programIds: [programId],
            });
          }
        }
      });

      result.filesProcessed++;

      // Progress indicator
      if ((i + 1) % 1000 === 0) {
        console.log(`⏳ Processed ${i + 1}/${files.length} files...`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}: ${(error as Error).message}`);
      result.filesWithErrors++;
    }
  }

  // Find program_ids that appear in multiple files
  result.programIdMap.forEach((occurrences, programId) => {
    if (occurrences.length > 1) {
      const uniqueFiles = new Set(occurrences.map((occ) => occ.fileName));

      if (uniqueFiles.size > 1) {
        // This program_id appears in multiple files
        if (result.examples.duplicateAcrossFiles.length < 10) {
          result.examples.duplicateAcrossFiles.push({
            programId,
            files: Array.from(uniqueFiles),
          });
        }
      }
    }
  });

  // Print results
  console.log("\n" + "=".repeat(60));
  console.log("📊 ANALYSIS RESULTS");
  console.log("=".repeat(60));
  console.log(`Total files found: ${result.totalFiles}`);
  console.log(`Files successfully processed: ${result.filesProcessed}`);
  console.log(`Files with JSON fixed: ${result.filesFixed}`);
  console.log(`Files with errors: ${result.filesWithErrors}`);
  console.log(`\nTotal unique program_ids: ${result.programIdMap.size}`);

  // Count duplicates
  const duplicateWithinFile = result.duplicateProgramIds.size;
  const duplicateAcrossFiles = Array.from(result.programIdMap.entries()).filter(
    ([_, occurrences]) => {
      const uniqueFiles = new Set(occurrences.map((occ) => occ.fileName));
      return uniqueFiles.size > 1;
    },
  ).length;

  console.log(
    `\nProgram_ids with duplicates within same file: ${duplicateWithinFile}`,
  );
  console.log(
    `Program_ids appearing in multiple files: ${duplicateAcrossFiles}`,
  );

  // Show examples
  console.log("\n" + "-".repeat(60));
  console.log("📋 EXAMPLES");
  console.log("-".repeat(60));

  if (result.examples.duplicateWithinFile.length > 0) {
    console.log("\n🔴 Duplicate program_ids within the same file:");
    result.examples.duplicateWithinFile.slice(0, 5).forEach((example, idx) => {
      const occurrences =
        result.programIdMap
          .get(example.programIds[0])
          ?.filter((occ) => occ.fileName === example.fileName) || [];
      console.log(`\n  ${idx + 1}. File: ${example.fileName}`);
      console.log(`     Program ID: ${example.programIds[0]}`);
      console.log(`     Appears ${occurrences.length} times in this file`);
    });
  } else {
    console.log("\n✅ No duplicate program_ids found within files");
  }

  if (result.examples.duplicateAcrossFiles.length > 0) {
    console.log("\n\n🟡 Program_ids appearing in multiple files:");
    result.examples.duplicateAcrossFiles.slice(0, 5).forEach((example, idx) => {
      const allOccurrences = result.programIdMap.get(example.programId) || [];
      console.log(`\n  ${idx + 1}. Program ID: ${example.programId}`);
      console.log(`     Appears in ${example.files.length} files:`);
      example.files.slice(0, 5).forEach((file) => {
        const count = allOccurrences.filter(
          (occ) => occ.fileName === file,
        ).length;
        console.log(`       - ${file} (${count} time${count > 1 ? "s" : ""})`);
      });
      if (example.files.length > 5) {
        console.log(`       ... and ${example.files.length - 5} more file(s)`);
      }
    });
  } else {
    console.log("\n✅ No program_ids found across multiple files");
  }

  // Show top 10 most common program_ids
  const sortedProgramIds = Array.from(result.programIdMap.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10);

  if (sortedProgramIds.length > 0) {
    console.log("\n\n📈 Top 10 most common program_ids:");
    sortedProgramIds.forEach(([programId, occurrences], idx) => {
      const uniqueFiles = new Set(occurrences.map((occ) => occ.fileName));
      console.log(`  ${idx + 1}. ${programId}`);
      console.log(`     Total occurrences: ${occurrences.length}`);
      console.log(`     In ${uniqueFiles.size} unique file(s)`);
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Analysis complete!");
  console.log("=".repeat(60) + "\n");
}

// Run the analysis
analyzeProgramIds().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

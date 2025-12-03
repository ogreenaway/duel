import * as fs from "fs";
import * as path from "path";

import { MongoClient } from "mongodb";
import { getCleanAdvocacyProgram } from "../data_validation/programs/getCleanAdvocacyProgram";
import { getCleanTasksCompletes } from "../data_validation/tasks/getCleanTask";
import { getCleanUser } from "../data_validation/users/getCleanUser";
import { getValidJson } from "../data_validation/getValidJson";

const MONGODB_URI = "mongodb://localhost:27017/duel";
const INITIAL_DATA_DIR = path.join(__dirname, "../../../initial_data");
const MAX_FILES = 10000;

interface InvalidProperty {
  entityType: "user" | "program" | "task";
  property: string;
  value: unknown;
}

// Helper function to find properties that were set to null
function findNullifiedProperties(
  original: any,
  cleaned: any,
  entityType: "user" | "program" | "task",
): InvalidProperty[] {
  const invalid: InvalidProperty[] = [];

  // Map original property names to cleaned property names
  // Note: ID fields (user_id, program_id, task_id) are not cleaned, just copied, so we don't track them
  const propertyMap: Record<string, string> = {};
  if (entityType === "user") {
    propertyMap.name = "name";
    propertyMap.email = "email";
    propertyMap.instagram_handle = "instagram_handle";
    propertyMap.tiktok_handle = "tiktok_handle";
    propertyMap.joined_at = "joined_at";
  } else if (entityType === "program") {
    propertyMap.brand = "brand";
    propertyMap.total_sales_attributed = "total_sales_attributed";
  } else if (entityType === "task") {
    propertyMap.platform = "platform";
    propertyMap.post_url = "post_url";
    propertyMap.likes = "likes";
    propertyMap.comments = "comments";
    propertyMap.shares = "shares";
    propertyMap.reach = "reach";
  }

  for (const [originalKey, cleanedKey] of Object.entries(propertyMap)) {
    const originalValue = original?.[originalKey];
    const cleanedValue = cleaned?.[cleanedKey];

    // Only track if:
    // 1. Original value exists and is not null, undefined, or empty string
    // 2. Cleaned value is null
    if (
      originalValue !== null &&
      originalValue !== undefined &&
      originalValue !== "" &&
      cleanedValue === null
    ) {
      invalid.push({
        entityType,
        property: originalKey,
        value: originalValue,
      });
    }
  }

  return invalid;
}

async function importData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("duel");
    const usersCollection = db.collection("users");
    const programsCollection = db.collection("programs");
    const tasksCollection = db.collection("tasks");

    const files = fs
      .readdirSync(INITIAL_DATA_DIR)
      .filter((file) => file.endsWith(".json") && file.startsWith("user_"))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || "0");
        const numB = parseInt(b.match(/\d+/)?.[0] || "0");
        return numA - numB;
      })
      .slice(0, MAX_FILES);

    console.log(`Found ${files.length} files to import`);

    let imported = 0;
    let skipped = 0;
    const invalidProperties: InvalidProperty[] = [];

    for (const file of files) {
      const filePath = path.join(INITIAL_DATA_DIR, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");

      let userData;

      // First attempt: try to parse as-is
      try {
        userData = JSON.parse(fileContent);
      } catch (firstError) {
        // Second attempt: try to fix malformed JSON by adding closing brackets
        try {
          const fixedJson = getValidJson(fileContent);
          userData = JSON.parse(fixedJson);
          console.log(`⚠️  Fixed malformed JSON in ${file}`);
        } catch (secondError) {
          console.error(
            `❌ Failed to parse ${file}:`,
            (secondError as Error).message,
          );
          skipped++;
          continue;
        }
      }

      const user = getCleanUser(userData);

      // Track properties set to null for user
      const userInvalid = findNullifiedProperties(userData, user, "user");
      invalidProperties.push(...userInvalid);

      const { insertedId: user_id } = await usersCollection.insertOne(user);
      const advocacyPrograms = userData.advocacy_programs || [];

      for (const programData of advocacyPrograms) {
        const program = getCleanAdvocacyProgram(programData);

        // Track properties set to null for program
        const programInvalid = findNullifiedProperties(
          programData,
          program,
          "program",
        );
        invalidProperties.push(...programInvalid);

        const { insertedId: program_id } = await programsCollection.insertOne({
          ...program,
          user_id: user_id,
        });

        const tasksCompleted = programData.tasks_completed || [];
        for (const taskData of tasksCompleted) {
          const task = getCleanTasksCompletes(taskData);

          // Track properties set to null for task
          const taskInvalid = findNullifiedProperties(taskData, task, "task");
          invalidProperties.push(...taskInvalid);

          await tasksCollection.insertOne({
            ...task,
            program_id: program_id,
            user_id: user_id,
          });
        }
      }

      imported++;

      if (imported % 10 === 0) {
        console.log(`Imported ${imported}/${files.length} users...`);
      }
    }

    console.log(`✅ Successfully imported ${imported} users to MongoDB`);
    if (skipped > 0) {
      console.log(`⚠️  Skipped ${skipped} files due to parsing errors`);
    }

    // Write invalid properties to file
    const outputPath = path.join(__dirname, "../../../invalid_properties.json");
    fs.writeFileSync(
      outputPath,
      JSON.stringify(invalidProperties, null, 2),
      "utf-8",
    );
    console.log(
      `📝 Wrote ${invalidProperties.length} invalid properties to ${outputPath}`,
    );
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

importData();

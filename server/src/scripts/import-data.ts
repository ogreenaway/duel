import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

import { getCleanUser } from '../data_validation/users/getCleanUser';
import { getValidJson } from '../data_validation/getValidJson';
import { getCleanAdvocacyProgram } from '../data_validation/programs/getCleanAdvocacyProgram';
import { getCleanTasksCompletes } from '../data_validation/tasks/getCleanTask';

const MONGODB_URI = 'mongodb://localhost:27017/duel';
const INITIAL_DATA_DIR = path.join(__dirname, '../../../initial_data');
const MAX_FILES = 100;

async function importData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('duel');
    const usersCollection = db.collection('users');
    const programsCollection = db.collection('programs');
    const tasksCollection = db.collection('tasks');
    
    const files = fs.readdirSync(INITIAL_DATA_DIR)
      .filter(file => file.endsWith('.json') && file.startsWith('user_'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      })
      .slice(0, MAX_FILES);
    
    console.log(`Found ${files.length} files to import`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const file of files) {
      const filePath = path.join(INITIAL_DATA_DIR, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      
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
          console.error(`❌ Failed to parse ${file}:`, (secondError as Error).message);
          skipped++;
          continue;
        }
      }

      const user = getCleanUser(userData);
      const {insertedId: user_id} = await usersCollection.insertOne(user);
      const advocacyPrograms = userData.advocacy_programs || [];
      
      for (const programData of advocacyPrograms) {
        const program = getCleanAdvocacyProgram(programData);

        const {insertedId: program_id} = await programsCollection.insertOne({
          ...program,
          user_id: user_id
        });
        
        const tasksCompleted = programData.tasks_completed || [];
        for (const taskData of tasksCompleted) {
          const task = getCleanTasksCompletes(taskData);
          await tasksCollection.insertOne({
            ...task,
            program_id: program_id,
            user_id: user_id
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
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

importData();

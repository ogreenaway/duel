import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';

const MONGODB_URI = 'mongodb://localhost:27017/duel';
const INITIAL_DATA_DIR = path.join(__dirname, '../../initial_data');
const MAX_FILES = 100;

async function importData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('duel');
    const usersCollection = db.collection('users');
    
    // Get all JSON files
    const files = fs.readdirSync(INITIAL_DATA_DIR)
      .filter(file => file.endsWith('.json') && file.startsWith('user_'))
      .sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)?.[0] || '0');
        const numB = parseInt(b.match(/\d+/)?.[0] || '0');
        return numA - numB;
      })
      .slice(0, MAX_FILES);
    
    console.log(`Found ${files.length} files to import`);
    
    // Import each file
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
        // Second attempt: try to fix malformed JSON
        try {
          const { getValidJson } = await import('../data_validation/getValidJson');
          const fixedJson = getValidJson(fileContent);
          userData = JSON.parse(fixedJson);
          console.log(`⚠️  Fixed malformed JSON in ${file}`);
        } catch (secondError) {
          console.error(`❌ Failed to parse ${file}:`, (secondError as Error).message);
          skipped++;
          continue;
        }
      }
      
      await usersCollection.insertOne(userData);
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

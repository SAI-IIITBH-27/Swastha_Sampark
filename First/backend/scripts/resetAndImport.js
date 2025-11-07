import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { execSync } from 'child_process';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

async function main() {
  console.log('Connecting to MongoDB:', MONGO);
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection.db;
  const existing = await db.listCollections().toArray();
  const names = existing.map((c) => c.name);

  const toDrop = ['hospitals', 'doctors', 'patients', 'referrals'];
  for (const n of toDrop) {
    if (names.includes(n)) {
      try {
        await db.dropCollection(n);
        console.log('Dropped collection:', n);
      } catch (err) {
        console.warn('Failed to drop', n, err.message);
      }
    } else {
      console.log('Collection not present, skipping drop:', n);
    }
  }

  await mongoose.disconnect();

  console.log('\nCollections dropped. Running import scripts (will use same MONGO_URI)...\n');
  const scripts = ['importHospitals.js', 'importDoctors.js', 'importPatients.js'];
  // after imports, create credentials for all records
  scripts.push('seedCredentials.js');
  for (const s of scripts) {
    console.log('--- Running', s, '---');
    try {
      execSync(`node scripts/${s}`, { stdio: 'inherit' });
    } catch (err) {
      console.error('Script failed:', s, err.message);
      throw err;
    }
  }

  console.log('\nReset and re-import complete.');
}

main().catch((err) => {
  console.error('Reset/import failed:', err);
  process.exit(1);
});

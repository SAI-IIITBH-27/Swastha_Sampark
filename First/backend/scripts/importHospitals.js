import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Hospital from '../models/hospital.model.js';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

const run = async () => {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const jsonPath = path.resolve(process.cwd(), '../my-app/src/assets/db.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('db.json not found at', jsonPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);
  const list = data.hospitals || [];

  const ops = list.map(h => ({
    updateOne: {
      filter: { name: h.name },
      update: { $set: { name: h.name, location: h.location, specialty: h.specialty, status: h.status, meta: h } },
      upsert: true,
    }
  }));

  if (ops.length) {
    const res = await Hospital.bulkWrite(ops);
    // log driver result details for clarity
    const upserted = res.upsertedCount || res.nUpserted || 0;
    const modified = res.modifiedCount || res.nModified || 0;
    console.log('BulkWrite result summary:', { upserted, modified });
    console.log('Full BulkWrite result object:', res);
  } else {
    console.log('No hospitals found to import');
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });

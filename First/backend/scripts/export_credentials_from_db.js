#!/usr/bin/env node
/*
  export_credentials_from_db.js

  Connects to the MongoDB specified in First/backend/.env (MONGO_URI)
  and exports the exact documents from collections that look like
  hospitals, doctors, and patients into
  First/backend/scripts/exported_credentials.json

  USAGE (from repo root):
    node First/backend/scripts/export_credentials_from_db.js

  Security: this will write any stored passwords (hashed or plaintext)
  to a local file. Do NOT commit that file. It's recommended to rotate
  credentials if you plan to share the exported file.
*/

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load .env from First/backend/.env
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const OUTPUT_PATH = path.resolve(__dirname, 'exported_credentials.json');

async function main() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not found in First/backend/.env. Please create and set it first.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection.db;

  // Find collection names that contain hospital/doctor/patient (case-insensitive)
  const collections = await db.listCollections().toArray();
  const names = collections.map(c => c.name.toLowerCase());

  function findName(keyword) {
    // prefer exact match, otherwise first that includes the keyword
    if (names.includes(keyword)) return keyword;
    const exact = names.find(n => n === keyword + 's');
    if (exact) return exact;
    return names.find(n => n.includes(keyword));
  }

  const hospitalColl = findName('hospital') || 'hospitals';
  const doctorColl = findName('doctor') || 'doctors';
  const patientColl = findName('patient') || 'patients';

  console.log('Using collections:', { hospitalColl, doctorColl, patientColl });

  const out = { meta: { exportedAt: new Date().toISOString(), source: uri.replace(/(mongodb\+srv:\/\/.*?:).*@/, '$1<hidden>@') }, hospitals: [], doctors: [], patients: [] };

  try {
    out.hospitals = await db.collection(hospitalColl).find({}).toArray();
  } catch (e) {
    console.warn('Failed to read hospitals collection:', e.message);
    out.hospitals = [];
  }

  try {
    out.doctors = await db.collection(doctorColl).find({}).toArray();
  } catch (e) {
    console.warn('Failed to read doctors collection:', e.message);
    out.doctors = [];
  }

  try {
    out.patients = await db.collection(patientColl).find({}).toArray();
  } catch (e) {
    console.warn('Failed to read patients collection:', e.message);
    out.patients = [];
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(out, null, 2), { encoding: 'utf8' });
  console.log('Export complete. File written to', OUTPUT_PATH);
  console.log('IMPORTANT: This file may contain sensitive data (password hashes or plaintext). Do not commit it.');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Error during export:', err);
  process.exit(1);
});

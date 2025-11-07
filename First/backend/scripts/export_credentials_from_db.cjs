#!/usr/bin/env node
/*
  CommonJS wrapper for environments with "type": "module" in package.json.
  Use: node First/backend/scripts/export_credentials_from_db.cjs
*/
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load .env from First/backend/.env
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const OUTPUT_PATH = path.resolve(__dirname, 'exported_credentials.json');

function parseArgUri() {
  // Check for --uri "VALUE" or --uri=VALUE
  const raw = process.argv.slice(2);
  for (let i = 0; i < raw.length; i++) {
    const a = raw[i];
    if (a === '--uri' && raw[i + 1]) return raw[i + 1];
    if (a.startsWith('--uri=')) return a.split('=')[1];
  }
  return null;
}

(async function main() {
  // Priority: CLI --uri, then env MONGO_URI_OVERRIDE, then First/backend/.env MONGO_URI
  const cliUri = parseArgUri();
  const envOverride = process.env.MONGO_URI_OVERRIDE;
  const uri = cliUri || envOverride || process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI not found. Provide it in First/backend/.env, or pass --uri "<uri>", or set MONGO_URI_OVERRIDE.');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  const names = collections.map(c => c.name.toLowerCase());

  function findName(keyword) {
    if (names.includes(keyword)) return keyword;
    const exact = names.find(n => n === keyword + 's');
    if (exact) return exact;
    return names.find(n => n.includes(keyword));
  }

  const hospitalColl = findName('hospital') || 'hospitals';
  const doctorColl = findName('doctor') || 'doctors';
  const patientColl = findName('patient') || 'patients';

  console.log('Using collections:', { hospitalColl, doctorColl, patientColl });

  const out = { meta: { exportedAt: new Date().toISOString() }, hospitals: [], doctors: [], patients: [] };

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
})().catch(err => {
  console.error('Error during export:', err);
  process.exit(1);
});

#!/usr/bin/env node
/*
  reset_and_seed.cjs

  Drops patient/hospital/doctor/referral related collections and inserts
  predictable mock data with credentials for local testing.

  USAGE (from repo root):
    node First/backend/scripts/reset_and_seed.cjs --yes

  Safety: The script will refuse to run unless you pass --yes. It writes
  a credentials file at First/backend/scripts/seeded_credentials.json (ignored).
*/

const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const OUT_FILE = path.resolve(__dirname, 'seeded_credentials.json');

function parseArgs() {
  const args = process.argv.slice(2);
  return { yes: args.includes('--yes') };
}

async function dropIfExists(db, name) {
  const cols = await db.listCollections({ name }).toArray();
  if (cols.length) {
    console.log('Dropping collection', name);
    await db.dropCollection(name);
  } else {
    console.log('Collection not found, skipping drop:', name);
  }
}

(async function main() {
  const args = parseArgs();
  if (!args.yes) {
    console.log('This script will DROP collections. To proceed, re-run with --yes');
    process.exit(0);
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI missing in First/backend/.env');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection.db;

  // Common collection names to drop if present
  const toDrop = ['hospitals', 'doctors', 'patients', 'referrals', 'appointments', 'prescriptions', 'hospitalreviews', 'doctorreviews', 'treatments'];
  for (const name of toDrop) {
    try {
      await dropIfExists(db, name);
    } catch (e) {
      console.warn('Error dropping', name, e.message);
    }
  }

  // Create seeded data
  const hospitals = [
    { name: 'Apollo Hospital', email: 'apollo@hospital.test', password: 'Apollo123!', role: 'hospital', availability: true },
    { name: 'CityCare Hospital', email: 'citycare@hospital.test', password: 'CityCare123!', role: 'hospital', availability: true },
    { name: 'GreenValley Hospital', email: 'greenvalley@hospital.test', password: 'GreenValley123!', role: 'hospital', availability: false }
  ];

  const doctors = [
    { name: 'Dr. Alice', email: 'alice@doctor.test', password: 'DrAlice1!', role: 'doctor' },
    { name: 'Dr. Bob', email: 'bob@doctor.test', password: 'DrBob1!', role: 'doctor' },
    { name: 'Dr. Carol', email: 'carol@doctor.test', password: 'DrCarol1!', role: 'doctor' }
  ];

  const patients = [
    { name: 'Patient One', email: 'p1@patient.test', password: 'Patient1!', role: 'patient' },
    { name: 'Patient Two', email: 'p2@patient.test', password: 'Patient2!', role: 'patient' },
    { name: 'Patient Three', email: 'p3@patient.test', password: 'Patient3!', role: 'patient' }
  ];

  // Hash passwords
  const all = [...hospitals, ...doctors, ...patients];
  for (const u of all) {
    // keep plaintext for output, but store hashed password in DB
    u.passwordPlain = u.password;
    u.passwordHash = await bcrypt.hash(u.passwordPlain, 10);
    delete u.password; // remove original field to avoid confusion
  }

  // Insert hospitals, doctors, patients
  const hospRes = await db.collection('hospitals').insertMany(hospitals.map(h => ({ name: h.name, email: h.email, password: h.passwordHash, role: h.role, availability: h.availability })));
  const insertedHospIds = Object.values(hospRes.insertedIds);

  const docRes = await db.collection('doctors').insertMany(doctors.map((d, i) => ({ name: d.name, email: d.email, password: d.passwordHash, role: d.role, hospital: insertedHospIds[i % insertedHospIds.length] })));
  const insertedDocIds = Object.values(docRes.insertedIds);

  const patRes = await db.collection('patients').insertMany(patients.map(p => ({ name: p.name, email: p.email, password: p.passwordHash, role: p.role })));
  const insertedPatIds = Object.values(patRes.insertedIds);

  // Create referrals: simulate each patient referred by a doctor at some hospital to another hospital
  const referrals = [];
  for (let i = 0; i < 9; i++) {
    const patientId = insertedPatIds[i % insertedPatIds.length];
    const fromHospital = insertedHospIds[i % insertedHospIds.length];
    const toHospital = insertedHospIds[(i + 1) % insertedHospIds.length];
    const doctorId = insertedDocIds[i % insertedDocIds.length];
    const status = i % 3 === 0 ? 'accepted' : (i % 3 === 1 ? 'rejected' : 'pending');
    referrals.push({ patient: patientId, fromHospital: fromHospital, toHospital: toHospital, fromDoctor: doctorId, toDoctor: null, status, date: new Date() });
  }

  const refRes = await db.collection('referrals').insertMany(referrals);

  // Compute counts per hospital
  const counts = {};
  for (const id of insertedHospIds) counts[id.toString()] = { received: 0, sent: 0 };
  const allRefs = await db.collection('referrals').find({}).toArray();
  for (const r of allRefs) {
    if (r.toHospital) counts[r.toHospital.toString()].received++;
    if (r.fromHospital) counts[r.fromHospital.toString()].sent++;
  }

  // Build credential output (plain passwords for testing)
  // Build credential output including plaintext passwords for local testing
  const creds = { hospitals: [], doctors: [], patients: [], stats: { perHospital: {} } };
  hospitals.forEach((h, i) => {
    creds.hospitals.push({ name: h.name, email: h.email, password: h.passwordPlain });
  });
  doctors.forEach((d, i) => creds.doctors.push({ name: d.name, email: d.email, password: d.passwordPlain, hospital: insertedHospIds[i % insertedHospIds.length].toString() }));
  patients.forEach((p, i) => creds.patients.push({ name: p.name, email: p.email, password: p.passwordPlain }));

  // For convenience include per-hospital stats and the referrals received with from-hospital/doctor info
  const hospIdToName = {};
  insertedHospIds.forEach((hid, idx) => hospIdToName[hid.toString()] = hospitals[idx].name);
  const docIdToName = {};
  insertedDocIds.forEach((did, idx) => docIdToName[did.toString()] = doctors[idx].name);
  const patIdToName = {};
  insertedPatIds.forEach((pid, idx) => patIdToName[pid.toString()] = patients[idx].name);

  insertedHospIds.forEach((hid, idx) => {
    creds.stats.perHospital[hid.toString()] = { name: hospitals[idx].name, received: counts[hid.toString()].received, sent: counts[hid.toString()].sent, receivedReferrals: [] };
  });

  for (const r of allRefs) {
    const toId = r.toHospital ? r.toHospital.toString() : null;
    if (toId && creds.stats.perHospital[toId]) {
      creds.stats.perHospital[toId].receivedReferrals.push({
        referralId: r._id.toString(),
        patient: patIdToName[r.patient ? r.patient.toString() : ''] || r.patient,
        fromHospital: r.fromHospital ? (hospIdToName[r.fromHospital.toString()] || r.fromHospital.toString()) : null,
        fromDoctor: r.fromDoctor ? (docIdToName[r.fromDoctor.toString()] || r.fromDoctor.toString()) : null,
        status: r.status,
        date: r.date
      });
    }
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(creds, null, 2), 'utf8');
  console.log('Seed complete. Credentials summary written to', OUT_FILE);
  console.log('Note: For safety this file does NOT contain plaintext passwords. If you need them, modify the script to include them (not recommended).');

  await mongoose.disconnect();
  process.exit(0);
})().catch(err => {
  console.error('Error in seed:', err);
  process.exit(1);
});

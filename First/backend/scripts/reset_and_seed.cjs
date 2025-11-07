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
    { name: 'GreenValley Hospital', email: 'greenvalley@hospital.test', password: 'GreenValley123!', role: 'hospital', availability: false },
    { name: "St. Mary's Hospital", email: 'stmarys@hospital.test', password: 'StMarys123!', role: 'hospital', availability: true },
    { name: 'Mercy General', email: 'mercy@hospital.test', password: 'MercyGen123!', role: 'hospital', availability: true },
    { name: 'Sunrise Medical Center', email: 'sunrise@hospital.test', password: 'Sunrise123!', role: 'hospital', availability: false }
  ];

  const doctors = [
    { name: 'Dr. Amit Sharma', email: 'amit.sharma@doctor.test', password: 'AmitSharma1!', role: 'doctor' },
    { name: 'Dr. Priya Singh', email: 'priya.singh@doctor.test', password: 'PriyaSingh1!', role: 'doctor' },
    { name: 'Dr. John Smith', email: 'john.smith@doctor.test', password: 'JohnSmith1!', role: 'doctor' },
    { name: 'Dr. Emily Clark', email: 'emily.clark@doctor.test', password: 'EmilyClark1!', role: 'doctor' },
    { name: 'Dr. Michael Brown', email: 'michael.brown@doctor.test', password: 'MichaelBrown1!', role: 'doctor' },
    { name: 'Dr. Fatima Khan', email: 'fatima.khan@doctor.test', password: 'FatimaKhan1!', role: 'doctor' },
    { name: 'Dr. Chen Wei', email: 'chen.wei@doctor.test', password: 'ChenWei1!', role: 'doctor' },
    { name: 'Dr. Laura García', email: 'laura.garcia@doctor.test', password: 'LauraGarcia1!', role: 'doctor' },
    { name: 'Dr. David O. Johnson', email: 'david.johnson@doctor.test', password: 'DavidJohn1!', role: 'doctor' }
  ];

  const patients = [
    { name: 'Rohit Kumar', email: 'rohit.kumar@patient.test', password: 'RohitKumar1!', role: 'patient' },
    { name: 'Ananya Sharma', email: 'ananya.sharma@patient.test', password: 'AnanyaSharma1!', role: 'patient' },
    { name: 'Michael Johnson', email: 'michael.johnson@patient.test', password: 'MichaelJ1!', role: 'patient' },
    { name: 'Sarah Lee', email: 'sarah.lee@patient.test', password: 'SarahLee1!', role: 'patient' },
    { name: 'Ahmed Ali', email: 'ahmed.ali@patient.test', password: 'AhmedAli1!', role: 'patient' },
    { name: 'Priya Patel', email: 'priya.patel@patient.test', password: 'PriyaPatel1!', role: 'patient' },
    { name: 'Carlos Mendes', email: 'carlos.mendes@patient.test', password: 'CarlosM1!', role: 'patient' },
    { name: 'Fatima Noor', email: 'fatima.noor@patient.test', password: 'FatimaNoor1!', role: 'patient' },
    { name: 'Olivia Brown', email: 'olivia.brown@patient.test', password: 'OliviaB1!', role: 'patient' }
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
  console.log('WARNING: This credentials summary CONTAINS plaintext passwords for local testing. Do NOT commit or share this file.');

  await mongoose.disconnect();
  process.exit(0);
})().catch(err => {
  console.error('Error in seed:', err);
  process.exit(1);
});

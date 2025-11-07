import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import Hospital from '../models/hospital.model.js';
import Doctor from '../models/doctor.model.js';
import Patient from '../models/patient.model.js';

dotenv.config();
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

function slugify(s) {
  return (s||'').toString().toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
}

function randomPassword(len = 10) {
  // simple readable random password
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#';
  let out = '';
  for (let i=0;i<len;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return out;
}

async function ensureUniqueEmail(base, collection) {
  let email = `${base}@example.com`;
  let idx = 1;
  // naive exists check
  while (await collection.findOne({ email })) {
    email = `${base}${idx}@example.com`;
    idx++;
  }
  return email;
}

async function main() {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding credentials');

  const creds = { hospitals: [], doctors: [], patients: [] };

  // Hospitals
  const hospitals = await Hospital.find();
  for (let i=0;i<hospitals.length;i++) {
    const h = hospitals[i];
    let email = h.email;
    if (!email) {
      const base = slugify(h.name || `hospital${i}`);
      email = await ensureUniqueEmail(base, Hospital);
    }
    const password = randomPassword(10);
    const hash = await bcrypt.hash(password, 10);
    h.email = email;
    h.password = hash;
    await h.save();
    creds.hospitals.push({ id: h._id.toString(), name: h.name, email, password });
    console.log('Seeded hospital credentials for', h.name, email);
  }

  // Doctors
  const doctors = await Doctor.find();
  for (let i=0;i<doctors.length;i++) {
    const d = doctors[i];
    let email = d.email;
    if (!email) {
      const base = slugify(d.name || `doctor${i}`);
      email = await ensureUniqueEmail(base, Doctor);
    }
    const password = randomPassword(10);
    const hash = await bcrypt.hash(password, 10);
    d.email = email;
    d.password = hash;
    await d.save();
    creds.doctors.push({ id: d._id.toString(), name: d.name, email, password });
    console.log('Seeded doctor credentials for', d.name, email);
  }

  // Patients
  const patients = await Patient.find();
  for (let i=0;i<patients.length;i++) {
    const p = patients[i];
    let email = p.email;
    if (!email) {
      const base = slugify(p.name || `patient${i}`) || `patient${i}`;
      email = await ensureUniqueEmail(base, Patient);
    }
    const password = randomPassword(10);
    const hash = await bcrypt.hash(password, 10);
    p.email = email;
    p.password = hash;
    await p.save();
    creds.patients.push({ id: p._id.toString(), name: p.name, email, password });
    console.log('Seeded patient credentials for', p.name, email);
  }

  // write creds to file (plaintext) for admin use
  const outPath = path.resolve(process.cwd(), 'scripts', 'created_credentials.json');
  fs.writeFileSync(outPath, JSON.stringify(creds, null, 2), { encoding: 'utf-8' });
  console.log('Wrote credentials to', outPath);

  await mongoose.disconnect();
  console.log('Credential seeding complete');
}

main().catch(err => { console.error('Seeding failed:', err); process.exit(1); });

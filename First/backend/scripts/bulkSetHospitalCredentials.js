import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Hospital from '../models/hospital.model.js';

dotenv.config();
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

const slugify = (s) => {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
};

const run = async () => {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB:', MONGO);

  // find hospitals missing email or password
  const hospitals = await Hospital.find({ $or: [ { email: { $exists: false } }, { email: null }, { password: { $exists: false } }, { password: null } ] });
  if (!hospitals.length) {
    console.log('No hospitals without credentials found.');
    await mongoose.disconnect();
    process.exit(0);
  }

  const created = [];
  for (const hosp of hospitals) {
    const base = slugify(hosp.name || ('hospital-' + hosp._id.toString().slice(-6)));
    let domain = 'example.com';
    if (hosp.location) domain = hosp.location.toLowerCase().replace(/[^a-z0-9]+/g, '') + '.example.com';
    let email = `${base}@${domain}`;

    // ensure uniqueness
    let counter = 0;
    while (await Hospital.findOne({ email })) {
      counter += 1;
      email = `${base}${counter}@${domain}`;
    }

    const password = 'Hosp!' + crypto.randomBytes(4).toString('hex');
    const hashed = await bcrypt.hash(password, 10);

    hosp.email = email;
    hosp.password = hashed;
    await hosp.save();

    created.push({ id: hosp._id.toString(), name: hosp.name, email, password });
    console.log('Created credentials for', hosp.name, email);
  }

  // write plain credentials to a file next to this script (WARNING: contains plaintext passwords)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outPath = path.resolve(__dirname, 'created_hospital_creds.json');
  fs.writeFileSync(outPath, JSON.stringify({ created, generatedAt: new Date().toISOString() }, null, 2), 'utf-8');
  console.log('Wrote credentials for', created.length, 'hospitals to', outPath);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(async (err) => { console.error(err); await mongoose.disconnect(); process.exit(1); });

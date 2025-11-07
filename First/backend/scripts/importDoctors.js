import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Hospital from '../models/hospital.model.js';
import Doctor from '../models/doctor.model.js';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

const run = async () => {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB', MONGO);

  // prefer a user-provided doctors.json in frontend assets
  const jsonPath = path.resolve(process.cwd(), '../my-app/src/assets/doctors.json');
  let doctorsList = [];

  if (fs.existsSync(jsonPath)) {
    console.log('Found doctors.json, importing from', jsonPath);
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(raw);
    doctorsList = data.doctors || data;
  } else {
    console.log('No doctors.json found; will generate sample doctors for each hospital');
    // load hospitals and generate 2 sample doctors per hospital
    const hospitals = await Hospital.find().lean();
    hospitals.forEach((h) => {
      doctorsList.push({ name: `Dr. ${h.name.split(' ')[0]} A`, specialization: h.specialty || 'General', hospitalName: h.name, email: `${h.name.replace(/\s+/g,'').toLowerCase()}.a@example.com` });
      doctorsList.push({ name: `Dr. ${h.name.split(' ')[0]} B`, specialization: h.specialty || 'General', hospitalName: h.name, email: `${h.name.replace(/\s+/g,'').toLowerCase()}.b@example.com` });
    });
  }


  // Build bulkWrite ops to upsert doctors
  const ops = [];
  for (const d of doctorsList) {
    let hosp = null;
    if (d.hospitalId) hosp = await Hospital.findById(d.hospitalId);
    else if (d.hospitalName) hosp = await Hospital.findOne({ name: d.hospitalName });

    const hospitalId = hosp ? hosp._id : undefined;
    const email = d.email || `${d.name.replace(/\s+/g,'.').toLowerCase()}@example.com`;
    const name = d.name;
    const specialization = d.specialization || 'General';
    const phone = d.phone || '';

    const filter = d.email ? { email } : { name, hospital: hospitalId };

    const update = { $set: { name, specialization, phone, hospital: hospitalId, email }, $setOnInsert: { createdAt: new Date() } };

    ops.push({ updateOne: { filter, update, upsert: true } });
  }

  if (ops.length) {
    const result = await Doctor.bulkWrite(ops, { ordered: false });
    const upserted = result.upsertedCount || result.nUpserted || 0;
    const modified = result.modifiedCount || result.nModified || 0;
    console.log('Doctors bulkWrite summary:', { attempted: ops.length, upserted, modified });
    console.log('Full result:', result);
  } else {
    console.log('No doctor operations to run');
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });

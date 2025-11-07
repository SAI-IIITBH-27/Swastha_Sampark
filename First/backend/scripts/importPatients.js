import dotenv from 'dotenv';
import mongoose from 'mongoose';
import faker from 'faker';
import Patient from '../models/patient.model.js';
import Hospital from '../models/hospital.model.js';
import Doctor from '../models/doctor.model.js';
import Referral from '../models/referral.model.js';

dotenv.config();
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

const run = async () => {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for patients import');

  const hospitals = await Hospital.find().lean();
  const doctors = await Doctor.find().lean();

  if (!hospitals.length) {
    console.log('No hospitals found - run importHospitals.js first');
  }

  // create 200 patients
  const patients = [];
  for (let i = 0; i < 200; i++) {
    const name = faker.name.findName();
    const email = `patient${i}_${Date.now()}@example.com`;
    patients.push({ name, email, phone: faker.phone.phoneNumber(), address: faker.address.streetAddress(), age: faker.datatype.number({ min: 1, max: 100 }), gender: faker.random.arrayElement(['Male','Female','Other']), medicalHistory: [] });
  }

  const patientOps = patients.map(p => ({ updateOne: { filter: { email: p.email }, update: { $set: p }, upsert: true } }));
  const pRes = await Patient.bulkWrite(patientOps, { ordered: false });
  console.log('Patients bulkWrite result:', { upsertedCount: pRes.upsertedCount || pRes.nUpserted || 0, modifiedCount: pRes.modifiedCount || pRes.nModified || 0 });

  // fetch inserted patients
  const insertedPatients = await Patient.find().lean();

  // generate referrals linking random patients to random hospitals and doctors
  const referralOps = [];
  for (const pat of insertedPatients.slice(0, 200)) {
    const hosp = hospitals[Math.floor(Math.random() * hospitals.length)];
    const doc = doctors.length ? doctors[Math.floor(Math.random() * doctors.length)] : null;
    const ref = { patient: pat._id, fromDoctor: doc ? doc._id : undefined, toDoctor: undefined, toHospital: hosp ? hosp._id : undefined, reason: 'Auto-generated referral for testing' };
    referralOps.push({ insertOne: { document: ref } });
  }

  if (referralOps.length) {
    const rRes = await Referral.bulkWrite(referralOps, { ordered: false });
    console.log('Referrals bulkWrite result:', rRes.insertedCount || rRes.nInserted || 0);
  }

  await mongoose.disconnect();
  console.log('Patients and referrals import done');
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });

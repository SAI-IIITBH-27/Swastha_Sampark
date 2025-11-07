import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Hospital from '../models/hospital.model.js';

dotenv.config();
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

const run = async (email) => {
  if (!email) { console.error('Usage: node findHospitalByEmail.js email'); process.exit(1); }
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  const hosp = await Hospital.findOne({ email }).lean();
  console.log(hosp);
  await mongoose.disconnect();
  process.exit(0);
};

const [, , email] = process.argv;
run(email).catch(err => { console.error(err); process.exit(1); });

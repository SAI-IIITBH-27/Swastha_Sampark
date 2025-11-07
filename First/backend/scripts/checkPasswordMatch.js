import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Hospital from '../models/hospital.model.js';

dotenv.config();
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

const run = async (email, plain) => {
  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  const hosp = await Hospital.findOne({ email }).lean();
  if (!hosp) { console.error('Hospital not found'); process.exit(2); }
  console.log('Stored hash:', hosp.password);
  const ok = await bcrypt.compare(plain, hosp.password || '');
  console.log('compare result:', ok);
  await mongoose.disconnect();
  process.exit(0);
};

const [, , email, plain] = process.argv;
if (!email || !plain) { console.error('Usage: node checkPasswordMatch.js email password'); process.exit(1); }
run(email, plain).catch(err => { console.error(err); process.exit(1); });

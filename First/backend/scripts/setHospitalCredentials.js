import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Hospital from '../models/hospital.model.js';

dotenv.config();
const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

const run = async (name, email, password) => {
  if (!name || !email || !password) {
    console.error('Usage: node setHospitalCredentials.js "Hospital Name" email@example.com "PlainPassword"');
    process.exit(1);
  }

  await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB:', MONGO);

  try {
    const hosp = await Hospital.findOne({ name });
    if (!hosp) {
      console.error('Hospital not found with name:', name);
      process.exit(2);
    }

    const hashed = await bcrypt.hash(password, 10);
    hosp.email = email;
    hosp.password = hashed;
    await hosp.save();
    console.log('Updated hospital:', { id: hosp._id.toString(), name: hosp.name, email: hosp.email });
    await mongoose.disconnect();
    console.log('Done. You can now login with the email and password provided.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    await mongoose.disconnect();
    process.exit(3);
  }
};

// read args from command line
const [,, ...args] = process.argv;
run(args[0], args[1], args[2]);

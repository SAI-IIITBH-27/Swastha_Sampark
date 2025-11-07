import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Hospital from '../models/hospital.model.js';

dotenv.config();

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sai3';

const run = async () => {
  try {
    const conn = await mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    console.log('Mongo URI used:', MONGO);
    console.log('Mongoose connection host:', mongoose.connection.host);
    console.log('Mongoose connection port:', mongoose.connection.port);
    console.log('Mongoose connection name:', mongoose.connection.name);

    const count = await Hospital.countDocuments();
    console.log('Hospital documents count:', count);

    const one = await Hospital.findOne().lean();
    console.log('Sample hospital document (or null):', one);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error checking hospitals:', err);
    process.exit(1);
  }
};

run();

import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: String,
  password: String,
  address: String,
  age: Number,
  gender: String,
  medicalHistory: [String],
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);

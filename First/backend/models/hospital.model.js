import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  specialty: String,
  phone: String,
  email: { type: String, unique: true, sparse: true },
  password: String, // hashed password for hospital admin
  status: { type: String, default: 'Available' }, // Available, Busy, Limited, etc.
  meta: Object,
}, { timestamps: true });

export default mongoose.model('Hospital', hospitalSchema);

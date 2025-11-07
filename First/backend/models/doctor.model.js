import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: String,
  email: { type: String, unique: true, sparse: true },
  phone: String,
  password: String,
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);

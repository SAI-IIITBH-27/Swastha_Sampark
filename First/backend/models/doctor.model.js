import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: String,
  email: { type: String, unique: true, sparse: true },
  phone: String,
  password: String,
  mustChangePassword: { type: Boolean, default: false },
  schedule: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: String,
    endTime: String,
  }],
  active: { type: Boolean, default: true },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);

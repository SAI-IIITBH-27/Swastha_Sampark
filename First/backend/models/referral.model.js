import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  fromDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  fromHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  toDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  toHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  reason: String,
  status: { type: String, enum: ['pending','accepted','rejected','passed'], default: 'pending' },
  hospitalResponse: {
    message: String,
    action: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    updatedAt: Date,
  },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model('Referral', referralSchema);

import mongoose from 'mongoose';

const treatmentSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  description: String,
  diagnosis: String,
  followUpDate: Date,
  status: {
    type: String,
    enum: ['In Progress', 'Completed'],
    default: 'In Progress',
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
}, { timestamps: true });

export default mongoose.model('Treatment', treatmentSchema);

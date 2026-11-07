import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
    }
  ],
  notes: String,
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
}, { timestamps: true });

export default mongoose.model('Prescription', prescriptionSchema);

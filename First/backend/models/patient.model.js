import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: String,
  password: String,
  mustChangePassword: { type: Boolean, default: false },
  address: String,
  age: Number,
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  medicalHistory: [String],
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  referredTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  referredAt: Date,
  admissionDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Admitted', 'Under Treatment', 'Under Observation', 'Referred', 'Discharged'],
    default: 'Admitted',
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);

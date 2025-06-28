const mongoose = require('mongoose');

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
});

module.exports = mongoose.model('Prescription', prescriptionSchema);

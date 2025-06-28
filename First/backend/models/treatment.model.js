const mongoose = require('mongoose');

const treatmentSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },
  description: String,
  diagnosis: String,
  followUpDate: Date,
});

module.exports = mongoose.model('Treatment', treatmentSchema);

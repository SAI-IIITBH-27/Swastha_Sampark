const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  fromDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  toDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  reason: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Referral', referralSchema);

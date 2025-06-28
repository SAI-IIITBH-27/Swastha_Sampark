const mongoose = require('mongoose');

const hospitalReviewSchema = new mongoose.Schema({
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
  },
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HospitalReview', hospitalReviewSchema);

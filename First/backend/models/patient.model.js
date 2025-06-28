const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  age: Number,
  gender: String,
  medicalHistory: [String],
});

module.exports = mongoose.model('Patient', patientSchema);

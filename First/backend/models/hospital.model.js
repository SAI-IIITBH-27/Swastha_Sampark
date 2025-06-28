const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  city: String,
});

module.exports = mongoose.model('Hospital', hospitalSchema);

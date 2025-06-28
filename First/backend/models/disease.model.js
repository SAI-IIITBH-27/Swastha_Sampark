const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  name: String,
  symptoms: [String],
  description: String,
});

module.exports = mongoose.model('Disease', diseaseSchema);

const mongoose = require('mongoose');

const travelNoteSchema = new mongoose.Schema({
  location: String,
  date: Date,
  memory: String,
  tags: [String],
  apiInfo: {
    country: String,
    flagUrl: String,
    region: String,
    currency: String,
    population: Number,
    languages: [String]
  }
});

module.exports = mongoose.model('TravelNote', travelNoteSchema);

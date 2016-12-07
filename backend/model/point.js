const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  coords: {
    lat: Number,
    lng: Number
  },
  color: String,
  title: String,
  description: String
});

module.exports = mongoose.model('point', pointSchema);

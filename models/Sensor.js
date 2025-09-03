const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  acidity: Number,
  nitrogen: Number,
  phosphorus: Number,
  potassium: Number,
  date: { type: Date, default: Date.now }
});

const sensorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, default: 'NPK' },
  readings: [readingSchema]
});

module.exports = mongoose.model('Sensor', sensorSchema);

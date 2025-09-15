const mongoose = require('mongoose');

const hourlySchema = new mongoose.Schema({
  hour: { type: String, required: true }, // ex: "00:00"
  temperature: Number,
  humidity: Number,
  acidity: Number,  // pH
  nitrogen: Number,
  phosphorus: Number,
  potassium: Number,
  createdAt: { type: Date, default: Date.now } // quando a leitura foi inserida
}, { _id: false });

const dailyReportSchema = new mongoose.Schema({
  sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true }, // normalized to midnight UTC/local
  hourlyReadings: [hourlySchema]
});

dailyReportSchema.index({ sensor: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyReport', dailyReportSchema);

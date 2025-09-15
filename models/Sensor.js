const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Identificação
  name: { type: String, required: true }, // ex: "Sensor Solo 01"
  plantationType: { type: String },       // ex: "Lettuce"

  // Ícone
  icon: {
    color: { type: String, default: "#7CFC00" },
    type: { type: String } // ex: "lettuce"
  },

  // Localização
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },

  serial: { type: String }, // opcional: id físico do sensor
  type: { type: String, default: 'NPK' }, // tipo do sensor (categoria técnica)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sensor', sensorSchema);

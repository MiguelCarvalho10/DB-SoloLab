const express = require('express');
const Sensor = require('../models/Sensor');

const router = express.Router();

// Adicionar leitura
router.post('/add', async (req, res) => {
  try {
    const { userId, temperature, humidity, acidity, nitrogen, phosphorus, potassium } = req.body;

    let sensor = await Sensor.findOne({ userId });
    if (!sensor) {
      sensor = new Sensor({ userId, readings: [] });
    }

    sensor.readings.push({ temperature, humidity, acidity, nitrogen, phosphorus, potassium });
    await sensor.save();

    res.json({ message: 'Leitura adicionada com sucesso!', sensor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar histórico
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sensor = await Sensor.findOne({ userId }).populate('userId', 'username');
    if (!sensor) return res.status(404).json({ error: 'Nenhum dado encontrado' });

    res.json(sensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

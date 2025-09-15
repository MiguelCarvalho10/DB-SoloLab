const express = require('express');
const Sensor = require('../models/Sensor');
const DailyReport = require('../models/DailyReport');
const router = express.Router();

// Criar sensor (assume body.userId)
router.post('/', async (req, res) => {
  try {
    const { userId, name, plantationType, icon, location, serial, type } = req.body;

    const sensor = new Sensor({
      userId,
      name,
      plantationType,
      icon,
      location,
      serial,
      type
    });

    await sensor.save();
    res.status(201).json(sensor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar sensor
router.put('/:id', async (req, res) => {
  try {
    const updated = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar sensor
router.delete('/:id', async (req, res) => {
  try {
    await Sensor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sensor deletado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Adicionar/atualizar leitura (faz upsert no documento diário)
// body: { sensorId, userId, timestamp, temperature, humidity, acidity, nitrogen, phosphorus, potassium }
router.post('/:sensorId/readings', async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { userId, timestamp, temperature, humidity, acidity, nitrogen, phosphorus, potassium } = req.body;

    const ts = timestamp ? new Date(timestamp) : new Date(); // permite enviar timestamp ou usar agora
    // Normaliza a data para meia-noite (local) -> facilita agrupar por dia
    const dateOnly = new Date(ts.getFullYear(), ts.getMonth(), ts.getDate());

    // hora string "HH:MM"
    const hh = String(ts.getHours()).padStart(2,'0');
    const mm = String(ts.getMinutes()).padStart(2,'0');
    const hourStr = `${hh}:${mm}`;

    // Tenta atualizar a hora existente
    let report = await DailyReport.findOne({ sensor: sensorId, date: dateOnly });
    if (!report) {
      report = new DailyReport({ sensor: sensorId, user: userId, date: dateOnly, hourlyReadings: [] });
    }

    // procura se já existe leitura para essa hora (exato HH:MM)
    const idx = report.hourlyReadings.findIndex(r => r.hour === hourStr);
    const newReading = { hour: hourStr, temperature, humidity, acidity, nitrogen, phosphorus, potassium };

    if (idx === -1) {
      report.hourlyReadings.push(newReading);
    } else {
      // atualiza leitura existente da hora
      report.hourlyReadings[idx] = { ...report.hourlyReadings[idx]._doc, ...newReading };
    }

    await report.save();
    res.json({ message: 'Leitura registrada', report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar relatório diário do sensor
// GET /api/sensors/:sensorId/daily?date=YYYY-MM-DD
router.get('/:sensorId/daily', async (req, res) => {
  try {
    const { sensorId } = req.params;
    const dateParam = req.query.date;
    if (!dateParam) return res.status(400).json({ error: 'date query param required (YYYY-MM-DD)' });
    const d = new Date(dateParam);
    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const report = await DailyReport.findOne({ sensor: sensorId, date: dateOnly }).populate('sensor', 'name serial');
    if (!report) return res.status(404).json({ error: 'Nenhum relatório encontrado' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listar sensores do usuário
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const sensors = await Sensor.find({ userId });
    res.json(sensors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

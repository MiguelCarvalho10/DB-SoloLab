const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

// Registrar usuário
router.post('/register', async (req, res) => {
  try {
    const { login, password, loginType } = req.body;
    const user = new User({ login, password, loginType });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Login
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    if (['email', 'phone'].includes(user.loginType)) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ error: 'Senha incorreta' });
    }

    res.json({ message: 'Login bem-sucedido!', userId: user._id, loginType: user.loginType });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

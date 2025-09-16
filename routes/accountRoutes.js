const express = require('express');
const Account = require('../models/Account');
const router = express.Router();

// Criar conta do usuário
router.post('/', async (req, res) => {
  try {
    const { userId, name, birthDate, profession, bio } = req.body;

    const account = new Account({ userId, name, birthDate, profession, bio });
    await account.save();

    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Buscar conta por userId
router.get('/:userId', async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.params.userId });
    if (!account) return res.status(404).json({ error: 'Conta não encontrada' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar dados gerais da conta (sem foto)
router.put('/:userId', async (req, res) => {
  try {
    const updated = await Account.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------- FOTO DE PERFIL (rotas específicas) --------

// Adicionar/alterar foto de perfil
router.put('/:userId/photo', async (req, res) => {
  try {
    const { profilePhoto } = req.body; // URL ou base64
    const updated = await Account.findOneAndUpdate(
      { userId: req.params.userId },
      { profilePhoto },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remover foto de perfil
router.delete('/:userId/photo', async (req, res) => {
  try {
    const updated = await Account.findOneAndUpdate(
      { userId: req.params.userId },
      { profilePhoto: null },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Deletar conta
router.delete('/:userId', async (req, res) => {
  try {
    await Account.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'Conta deletada com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

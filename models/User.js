const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  loginType: { type: String, enum: ['email', 'phone', 'google', 'github', 'microsoft'], default: 'email' },
  password: { type: String },
  providers: {
    google: { id: String, email: String },
    github: { id: String, email: String },
    microsoft: { id: String, email: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Hook para executar antes de salvar
userSchema.pre('save', async function(next) {
  // `this` é o documento que está sendo salvo
  // Se o password não foi modificado, ou não existe, pular criptografia
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // 10 é um número bom para salt
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);

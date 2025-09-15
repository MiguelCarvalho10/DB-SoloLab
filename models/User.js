const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String }, // leave empty for OAuth users
  providers: {
    google: { id: String, email: String },
    github: { id: String, email: String }
    // adicione o que precisar
  },
  createdAt: { type: Date, default: Date.now }
});

// hash antes de salvar (se password existir/modificado)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);

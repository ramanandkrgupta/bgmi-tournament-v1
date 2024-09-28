const mongoose = require('mongoose');
   const bcrypt = require('bcrypt');

   const UserSchema = new mongoose.Schema({
       username: { type: String, required: true, unique: true },
       email: { type: String, required: true, unique: true },
       password: { type: String, required: true },
       matchesPlayed: { type: Number, default: 0 },
       matchesWon: { type: Number, default: 0 },
       earnings: { type: Number, default: 0 },
       referralBonus: { type: Number, default: 0 }
   });

   UserSchema.pre('save', async function(next) {
       if (!this.isModified('password')) return next();
       this.password = await bcrypt.hash(this.password, 10);
       next();
   });

   UserSchema.methods.comparePassword = function(password) {
       return bcrypt.compare(password, this.password);
   };

   module.exports = mongoose.model('User', UserSchema);
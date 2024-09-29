const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    referralCode: { type: String, unique: true },
    referredBy: { type: String },
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    depositWallet: { type: Number, default: 0 },
    bonusWallet: { type: Number, default: 0 },
    winningsWallet: { type: Number, default: 0 }
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateReferralCode = function() {
    this.referralCode = this._id.toString().slice(-6); // Example logic for referral code generation
};

module.exports = mongoose.model('User', UserSchema);
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type: String, require: true},
    email:{ type: String, require: true, unique: true},
    password: {type: String, require: true},
    otp:{type: String},
    otpExpiry:{type: Date},
    isVerified:{type: Boolean, default: false}

});

const User = mongoose.model('User', UserSchema);

module.exports = User;
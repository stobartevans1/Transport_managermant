const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    empId: { type: String, unique: true }, // Added empId field
    name: { type: String, required: true },
    gmail: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
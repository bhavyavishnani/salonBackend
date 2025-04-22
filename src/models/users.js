const mongoose = require('mongoose');

// User schema definition
const userSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    password: { type: String, required: true }, // Assuming password is hashed
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'users' } // Explicit collection name
);

module.exports = mongoose.model('User', userSchema);

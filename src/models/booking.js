const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'salons', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

  serviceIds: [{ type: String, required: true }], // <-- Change this!

  slot: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('bookings', bookingSchema);

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }
});

const bookingSchema = new mongoose.Schema({
  salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'salons', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  service: { type: serviceSchema, required: true },
  slot: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'bookings' });

module.exports = mongoose.model('bookings', bookingSchema);
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }
});

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  location: { lat: Number, lng: Number },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  services: [serviceSchema],
  images: [String],
  working_hours: String,
  verified: { type: Boolean, default: false },
  seats: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
  nextAvailableSlot: String,
  createdAt: { type: Date, default: Date.now }
}, { collection: 'salons' });

module.exports = mongoose.model('Salon', salonSchema);
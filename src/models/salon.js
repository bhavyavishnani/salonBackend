const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  rating: { type: Number, default: 0 },
  reviews: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewText: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  services: [{
    name: String,
    price: Number,
    duration: String,
  }],
  images: [String],
  workingHours: {
    openingTime: String,
    closingTime: String,
  },
  isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const Salon = mongoose.model('Salon', salonSchema);

module.exports = Salon;

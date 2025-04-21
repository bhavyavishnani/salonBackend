const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    location: { lat: { type: Number }, lng: { type: Number } },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    services: [{ type: String }],
    images: [{ type: String }],
    working_hours: { type: String },
    verified: { type: Boolean, default: false }
}, { collection: 'salons' }); // Explicit collection name

module.exports = mongoose.model('Salon', salonSchema);
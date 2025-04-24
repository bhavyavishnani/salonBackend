// salonModel.js
const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    rating: { type: Number },
    reviews: { type: Number },
    services: [
        {
            name: String,
            price: Number,
            duration: String
        }
    ],
    images: [String],
    working_hours: { type: String },
    verified: { type: Boolean },
    seats: { type: Number },
    bookedSeats: { type: Number },
    nextAvailableSlot: { type: String },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'bookings' }]
}, { timestamps: true });

const Salon = mongoose.model('Salon', salonSchema);
module.exports = Salon;

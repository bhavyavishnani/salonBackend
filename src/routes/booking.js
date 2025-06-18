const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Salon = require('../models/salon');

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { salonId, userId, serviceIds, slot, date } = req.body;

    // Validate required fields
    if (!salonId || !userId || !Array.isArray(serviceIds) || serviceIds.length === 0 || !slot || !date) {
      return res.status(400).json({ message: 'All fields are required, including an array of serviceIds.' });
    }

    // Check if salon exists
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found.' });
    }

    // Validate all serviceIds exist in salon.services
    const invalidServices = serviceIds.filter(
      id => !salon.services.find(s => s._id && s._id.toString() === id)
    );


    if (invalidServices.length > 0) {
      return res.status(400).json({ message: 'One or more service IDs are invalid for this salon', invalidServices });
    }

    // Optional: calculate total price
    const selectedServices = salon.services.filter(
  s => s._id && serviceIds.includes(s._id.toString())
);

    const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

    // Create booking
    const newBooking = new Booking({
      salonId,
      userId,
      serviceIds,
      slot,
      date: new Date(date),
      totalAmount: totalPrice // optional field if your schema allows
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });

  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

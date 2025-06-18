const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Salon = require('../models/salon');


// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { salonId, userId, serviceId, slot, date } = req.body;

    // Validate required fields
    if (!salonId || !userId || !serviceId || !slot || !date) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if salon exists
    const salon = await Salon.findById(salonId);
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found.' });
    }

    // Check if serviceId exists in that salon's services array
    const service = salon.services.find(s => s._id.toString() === serviceId);
    if (!service) {
      return res.status(400).json({ message: 'Service not found in this salon.' });
    }

    // Create booking
    const newBooking = new Booking({
      salonId,
      userId,
      serviceId,
      slot,
      date: new Date(date),
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully!', booking: newBooking });

  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

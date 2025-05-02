// src/routes/booking.js

const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

// Cancel a booking
router.delete('/:bookingId', async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found!' });
    }

    // Optional: only allow cancellation if status is still "booked"
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;

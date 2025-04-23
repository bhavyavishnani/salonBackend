const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Mongoose models (import the schemas defined earlier)
const Salon = require('../models/salon'); // Salon model
const User = require('../models/users');   // User model
const Booking = require('../models/booking'); // Booking model

// Validation for booking
const validateBooking = [
  body('salonId').notEmpty().withMessage('Salon ID is required'),
  body('userId').notEmpty().withMessage('User ID is required'),
  body('service.name').notEmpty().withMessage('Service name is required'),
  body('service.price').isNumeric().withMessage('Price must be a number'),
  body('service.duration').notEmpty().withMessage('Duration is required'),
  body('slot').notEmpty().withMessage('Slot is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s?(AM|PM)$/i).withMessage('Invalid time format (HH:MM AM/PM)'),
  body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Invalid date format (YYYY-MM-DD)').custom((value, { req }) => {
    const today = new Date().toISOString().split('T')[0];
    if (value < today) throw new Error('Date must be in the future');
    return true;
  }),
];

router.post('/', auth, validateBooking, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract and validate the booking data from the request body
    const { salonId, userId, service, slot, date } = req.body;

    // Find the salon and user using Mongoose models
    const salon = await Salon.findById(salonId);
    const user = await User.findById(userId);

    if (!salon) {
      return res.status(404).json({ error: 'Salon not found' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if salon has available seats
    if (salon.bookedSeats >= salon.seats) {
      return res.status(400).json({ error: 'No seats available' });
    }

    // Validate the booking time within working hours
    const [startTime, endTime] = salon.working_hours.split(' - ');
    const bookingTime = new Date(`1970-01-01 ${slot}`);
    const start = new Date(`1970-01-01 ${startTime}`);
    const end = new Date(`1970-01-01 ${endTime}`);
    
    if (bookingTime < start || bookingTime > end) {
      return res.status(400).json({ error: 'Slot outside working hours' });
    }

    // Check if the slot is already booked
    const existingBooking = await Booking.findOne({ salonId, slot, date });
    if (existingBooking) {
      return res.status(400).json({ error: 'Slot already booked' });
    }

    // Update salon bookedSeats and next available slot using Mongoose
    salon.bookedSeats += 1;
    const nextSlot = new Date(bookingTime);
    nextSlot.setHours(nextSlot.getHours() + 1);
    salon.nextAvailableSlot = nextSlot.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Save the updated salon information
    await salon.save();

    // Create a booking using Mongoose model
    const booking = new Booking({ salonId, userId, service, slot, date });
    await booking.save();

    // Return the booking data
    res.status(201).json(booking);
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});

module.exports = router;
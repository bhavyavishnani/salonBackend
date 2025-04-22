const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');  // Correctly import ObjectId
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
require('dotenv').config();  // Load environment variables from .env

// Get the MongoDB URI and database name from the .env file
const uri = process.env.MONGODB_URI;
const dbName = "<dbname>";  // Fetch the database name from .env

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
    // Log the number of salons and users
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbName);

    const salonCollection = db.collection('salons');
    const userCollection = db.collection('users');

    const salonCount = await salonCollection.countDocuments();  // Count number of salons
    const userCount = await userCollection.countDocuments();    // Count number of users
    console.log('Number of Salons:', salonCount);
    console.log('Number of Users:', userCount);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { salonId, userId, service, slot, date } = req.body;

    // Log the values of salonId and userId
    console.log('Salon ID:', salonId);
    console.log('User ID:', userId);

    // Find the salon and user documents using their IDs
    const salon = await salonCollection.findOne({ _id: new ObjectId(salonId) });
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });

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
    const bookingTime = new Date(`1970-01-01 ${slot.replace(/(\d+):(\d+)\s?(AM|PM)/i, '$1:$2 $3')}`);
    const start = new Date(`1970-01-01 ${startTime}`);
    const end = new Date(`1970-01-01 ${endTime}`);
    if (bookingTime < start || bookingTime > end) {
      return res.status(400).json({ error: 'Slot outside working hours' });
    }

    // Check if the slot is already booked
    const existingBooking = await db.collection('bookings').findOne({ salonId, slot, date });
    if (existingBooking) {
      return res.status(400).json({ error: 'Slot already booked' });
    }

    // Begin transaction
    const session = client.startSession();
    session.startTransaction();
    try {
      // Update salon bookedSeats and next available slot
      salon.bookedSeats += 1;
      const nextSlot = new Date(bookingTime);
      nextSlot.setHours(nextSlot.getHours() + 1);
      salon.nextAvailableSlot = nextSlot.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      await salonCollection.updateOne({ _id: new ObjectId(salonId) }, { $set: { bookedSeats: salon.bookedSeats, nextAvailableSlot: salon.nextAvailableSlot } }, { session });

      // Create a booking
      const booking = { salonId, userId, service, slot, date };
      await db.collection('bookings').insertOne(booking, { session });

      // Commit transaction
      await session.commitTransaction();
      res.status(201).json(booking);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
      client.close();
    }
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const signupRouter = require('./signup'); // Signup file import
const loginRouter = require('./login');
const salonsRouter = require('./salons');
const bookingRouter = require('./booking');
const paymentRouter = require('./payment');
const verifyPaymentRouter = require('./verifyPayment');
const createSalonRouter = require('./createSalon');
const getSalonRouter = require('./getSalon');
const reviewRouter = require('./salonReview');
const cancelRouter = require('./cancelBooking');

router.get('/test', async (req, res) => {
    res.send('BACKEND IS RUNNING SMOOTHLY🕺🏻🥳');
});

router.use('/', signupRouter);// This will make it /api/signup
router.use('/', loginRouter);
router.use('/salons', salonsRouter);
router.use('/booking', bookingRouter);
router.use('/payment', paymentRouter);
router.use('/', verifyPaymentRouter);
router.use('/', createSalonRouter);
router.use('/salons', getSalonRouter);
router.use('/salons', reviewRouter);
router.use('/cancel-booking', cancelRouter);
module.exports = router;
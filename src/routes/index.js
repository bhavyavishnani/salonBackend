const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const signupRouter = require('./signup'); // Signup file import
const loginRouter = require('./login');
const salonsRouter = require('./salons');
const bookingRouter = require('./booking');

router.get('/test', async (req, res) => {
    res.send('BACKEND IS RUNNING SMOOTHLY🕺🏻🥳');
});

router.use('/', signupRouter);// This will make it /api/signup
router.use('/', loginRouter);
router.use('/salons', salonsRouter);
router.use('/booking', bookingRouter);

module.exports = router;
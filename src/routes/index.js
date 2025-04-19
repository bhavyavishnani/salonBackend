const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const signupRouter = require('./signup'); // Signup file import
const loginRouter = require('./login');

router.get('/test', async (req, res) => {
    res.send('Muh mein lele mera!!😏🍌');
});

router.use('/', signupRouter);// This will make it /api/signup
router.use('/', loginRouter);

module.exports = router;
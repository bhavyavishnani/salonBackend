const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const signupRouter = require('./signup'); // Signup file import

router.get('/test', async (req, res) => {
    res.send('Muh mein lele mera!!😏🍌');
});

router.use('/', signupRouter); // This will make it /api/signup


module.exports = router;
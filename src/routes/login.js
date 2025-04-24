const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users'); // ✅ Use the Mongoose model
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.status(400).json({ error: 'Phone number aur password chahiye!' });
        }

        const user = await User.findOne({ phoneNumber }); // ✅ Using Mongoose here

        if (!user) {
            return res.status(404).json({ error: 'User nahi mila!' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Galat password!' });
        }

        const token = jwt.sign(
            { userId: user._id, phoneNumber: user.phoneNumber },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            user: {
                phoneNumber: user.phoneNumber,
                customerName: user.customerName
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server mein kuch gadbad hai!' });
    }
});

module.exports = router;

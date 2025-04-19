const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const JWT_SECRET = process.env.JWT_SECRET; // JWT secret from .env

router.post('/login', async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        if (!phoneNumber || !password) {
            return res.status(400).json({ error: 'Phone number aur password chahiye!' });
        }

        const db = await connectDB();
        const user = await db.collection('users').findOne({ phoneNumber });

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

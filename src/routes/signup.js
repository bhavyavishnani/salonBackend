const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users'); // Mongoose model

router.post('/signup', async (req, res) => {
    try {
        const { phoneNumber, customerName, password } = req.body;

        // Basic validation
        if (!phoneNumber || !customerName || !password) {
            return res.status(400).json({ error: 'Phone number, customer name, aur password zaroori hain!' });
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ error: 'Phone number 10 digits ka hona chahiye!' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password kam se kam 6 characters ka hona chahiye!' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'Ye phone number already registered hai!' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            phoneNumber,
            customerName,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: 'Signup successful!',
            user: {
                phoneNumber: newUser.phoneNumber,
                customerName: newUser.customerName,
            },
            status: 'success'
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: 'Server mein kuch problem hai',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;

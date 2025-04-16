const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
    try {
        const { phoneNumber, customerName, password } = req.body;
        if (!phoneNumber || !customerName || !password) {
            return res.status(400).json({ error: 'Phone number, customer name, aur password zaroori hain!' });
        }
        if (!/^\d{10}$/.test(phoneNumber)) {
            return res.status(400).json({ error: 'Phone number 10 digits ka hona chahiye!' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password kam se kam 6 characters ka hona chahiye!' });
        }

        const db = await connectDB();
        const existingUser = await db.collection('users').findOne({ phoneNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'Ye phone number already registered hai!' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = {
            phoneNumber,
            customerName,
            password: hashedPassword,
            createdAt: new Date()
        };
        await db.collection('users').insertOne(newUser);

        res.status(201).json({
            message: 'Signup successful!',
            data: { phoneNumber, customerName },
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
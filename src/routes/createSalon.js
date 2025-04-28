const express = require('express');
const router = express.Router();
const Salon = require('../models/salon');

router.post('/create-salon', async (req, res) => {
    try {
        const {
            name, owner, email, phone, address, city,
            location, services, images, workingHours
        } = req.body;

        const newSalon = new Salon({
            name,
            owner,
            email,
            phone,
            address,
            city,
            location,
            services,
            images,
            workingHours,
            isVerified: false // default
        });

        await newSalon.save();

        res.status(201).json({
            message: 'Salon created successfully!',
            salon: newSalon,
        });
    } catch (error) {
        console.error('Salon creation error:', error);
        res.status(500).json({ error: 'Server error, salon not created!' });
    }
});

module.exports = router;

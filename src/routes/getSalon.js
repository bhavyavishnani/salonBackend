const express = require('express');
const router = express.Router();
const Salon = require('../models/salon'); // Apne Salon model ka path de

// GET salon by ID
router.get('/:id', async (req, res) => {
    try {
        const salonId = req.params.id;

        const salon = await Salon.findById(salonId);

        if (!salon) {
            return res.status(404).json({ success: false, message: 'Salon nahi mila!' });
        }

        res.status(200).json({ success: true, salon });
    } catch (error) {
        console.error('Salon fetch error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

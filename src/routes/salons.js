const express = require('express');
const router = express.Router();
const Salon = require('../models/salon'); // apne Salon schema ka path

// Route to get salons, optionally filtered by city
router.get('/', async (req, res) => {
  try {
    const city = req.query.city ? req.query.city.trim() : '';

    let filter = {};
    if (city) {
      filter.city = { $regex: new RegExp(city, 'i') }; // Case-insensitive search
    }

    const salons = await Salon.find(filter);

    if (salons.length === 0) {
      return res.status(404).json({ message: 'Koi salons nahi mile is city mein.' });
    }

    res.status(200).json({ success: true, salons });
  } catch (error) {
    console.error("Error fetching salons:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Salon = require('../models/salon');

// Add a review to a salon
router.post('/:salonId/reviews', async (req, res) => {
    const { salonId } = req.params;
    const { userId, reviewText, rating } = req.body;

    // Parse rating explicitly
    const parsedRating = Number(rating);

    if (!userId || !reviewText || isNaN(parsedRating)) {
        return res.status(400).json({ error: 'userId, reviewText aur valid rating zaroori hain!' });
    }

    try {

        const salon = await Salon.findById(salonId);
        if (!salon) {
            return res.status(404).json({ error: 'Salon nahi mila!' });
        }

        const newReview = {
            userId,
            reviewText,
            rating: parsedRating,
            createdAt: new Date()
        };

        salon.reviews.push(newReview);

        // Filter out invalid ratings just in case
        const validRatings = salon.reviews
            .map(r => Number(r.rating))
            .filter(r => !isNaN(r));

        const totalRating = validRatings.reduce((sum, r) => sum + r, 0);
        salon.rating = validRatings.length > 0 ? totalRating / validRatings.length : 0;


        await salon.save();

        res.status(200).json({ success: true, message: 'Review added successfully!' });
    } catch (error) {
        console.error('Review error:', error);
        res.status(500).json({ error: 'Server error aaya hai!' });
    }
});

module.exports = router;

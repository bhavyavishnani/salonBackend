const express = require('express');
const router = express.Router();
const connectDB = require('../config/db');
const signupRouter = require('./signup'); // Signup file import

router.get('/test', async (req, res) => {
    try {
        const db = await connectDB();
        const collection = db.collection('testCollection');
        const data = await collection.find({}).toArray();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Kuch problem hai database mein' });
    }
});

router.use('/', signupRouter); // This will make it /api/signup


module.exports = router;
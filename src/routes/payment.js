// src/routes/payment.js
const express = require('express');
const router = express.Router();
const razorpayInstance = require('../config/razorpay');

router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency } = req.body; // frontend se amount milega

        const options = {
            amount: amount * 100, // Razorpay amount paise mein leta hai, isliye *100
            currency: currency || "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });

    } catch (error) {
        console.error('Payment order creation error:', error);
        res.status(500).json({ error: 'Payment order creation failed!' });
    }
});

module.exports = router;

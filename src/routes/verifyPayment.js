const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET; // .env se uthao

router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        // 1. Signature generate karo server pe
        const generated_signature = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        // 2. Compare karo dono signature
        if (generated_signature === razorpay_signature) {
            // Signature match ho gaya --> Payment valid
            return res.status(200).json({
                success: true,
                message: 'Payment verified successfully!',
                paymentId: razorpay_payment_id
            });
        } else {
            // Signature mismatch --> Payment fraud ya error
            return res.status(400).json({
                success: false,
                message: 'Payment verification failed!'
            });
        }

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;

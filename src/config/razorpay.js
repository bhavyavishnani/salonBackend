// src/config/razorpay.js
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,    // id jo mila hai
    key_secret: process.env.RAZORPAY_KEY_SECRET // secret jo mila hai
});

module.exports = razorpayInstance;

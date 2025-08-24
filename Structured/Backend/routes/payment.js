const express = require('express');
const razorpay = require('../config/razorpay');
const router = express.Router();

router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const options = {
      amount: amount * 100, // convert to paise
      currency: 'INR',
      receipt: 'order_' + Date.now()
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
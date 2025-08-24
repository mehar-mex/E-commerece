const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// In-memory cart storage (in production, use database)
const carts = {};

// Get cart
router.get('/', auth, (req, res) => {
  const cart = carts[req.user._id] || [];
  res.json(cart);
});

// Add to cart
router.post('/add', auth, (req, res) => {
  try {
    const { productId, name, price, image, quantity = 1 } = req.body;
    const userId = req.user._id;
    
    if (!carts[userId]) {
      carts[userId] = [];
    }
    
    const existingItem = carts[userId].find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      carts[userId].push({ productId, name, price, image, quantity });
    }
    
    res.json(carts[userId]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update cart item
router.put('/update', auth, (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;
    
    if (carts[userId]) {
      const item = carts[userId].find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    
    res.json(carts[userId] || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', auth, (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.productId;
    
    if (carts[userId]) {
      carts[userId] = carts[userId].filter(item => item.productId !== productId);
    }
    
    res.json(carts[userId] || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
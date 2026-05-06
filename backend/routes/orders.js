const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { orderId, customer, items, totalAmount, currency, userId } = req.body;
    
    const order = new Order({
      orderId,
      customer,
      items,
      totalAmount,
      currency: currency || 'INR',
      userId
    });
    
    await order.save();
    
    if (userId) {
      await User.findByIdAndUpdate(userId, { $push: { orders: order._id } });
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/track/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).populate('items.productId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
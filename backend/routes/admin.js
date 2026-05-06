const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Admin = require('../models/Admin');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Setup default admin
const setupAdmin = async (req, res) => {
  try {
    const defaultAdmin = await Admin.findOne({ username: 'priyanshu' });
    if (!defaultAdmin) {
      await Admin.create({
        username: 'priyanshu',
        password: 'admin123',
        name: 'Priyanshu'
      });
      return res.json({ message: 'Admin setup complete' });
    }
    res.json({ message: 'Admin already exists' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'qualityzone_super_secret_2024', { expiresIn: '7d' });
    res.json({ 
      token, 
      admin: { id: admin._id, name: admin.name, username: admin.username } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add product
router.post('/products', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, size, color, stock, featured } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const product = new Product({
      name, description, price: parseFloat(price),
      category, size: size ? size.split(',') : [],
      color: color ? color.split(',') : [],
      images, stock: parseInt(stock), featured: featured === 'true'
    });
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const updates = req.body;
    if (req.files) updates.images = req.files.map(file => `/uploads/${file.filename}`);
    
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, paymentStatus: req.body.paymentStatus },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
module.exports.setupAdmin = setupAdmin;
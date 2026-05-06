const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Priyanshu_db_user:Anshuman%40123@quality-zone-db.pzm1k0z.mongodb.net/qualityzone?retryWrites=true&w=majority')
  .then(() => console.log('✅ MongoDB OK'))
  .catch(err => console.log('❌ MongoDB:', err.message));

// SIMPLE SAMPLE DATA (No files needed!)
const sampleProducts = [
  {
    _id: '1',
    name: 'Premium Cotton T-Shirt',
    description: '100% Cotton, Comfort Fit',
    price: 2999,
    category: 'men',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    stock: 50,
    featured: true
  },
  {
    _id: '2', 
    name: 'Designer Denim Jeans',
    description: 'Slim fit, premium denim',
    price: 4999,
    category: 'men',
    images: ['https://images.unsplash.com/photo-1542272604-787c38355341?w=500'],
    stock: 30,
    featured: true
  }
];

// API ROUTES (No external files!)
app.get('/api/products', (req, res) => {
  res.json({ products: sampleProducts });
});

app.get('/api/products/:id', (req, res) => {
  const product = sampleProducts.find(p => p._id === req.params.id);
  product ? res.json(product) : res.status(404).json({ error: 'Not found' });
});

app.get('/api/currency/countries', (req, res) => {
  res.json({
    'IN': { name: 'India', currency: 'INR', flag: '🇮🇳' },
    'US': { name: 'United States', currency: 'USD', flag: '🇺🇸' },
    'GB': { name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' }
  });
});

app.post('/api/orders', (req, res) => {
  console.log('New Order:', req.body);
  res.json({ 
    message: 'Order received! Order ID: QZ-' + Date.now(),
    orderId: 'QZ-' + Date.now()
  });
});

// Health
app.get('/', (req, res) => res.json({ status: 'Quality Zone API LIVE ✅' }));
app.get('/admin/setup', (req, res) => res.json({ message: 'Admin ready!' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 LIVE on port ${PORT}`);
  console.log(`📱 http://localhost:${PORT}/`);
});

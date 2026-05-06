const express = require('express');
const { CURRENCIES, COUNTRIES } = require('../middleware/currency');
const router = express.Router();

router.get('/countries', (req, res) => res.json(COUNTRIES));
router.get('/currencies', (req, res) => res.json(CURRENCIES));

router.get('/convert', (req, res) => {
  const { amount, from = 'INR', to = 'USD' } = req.query;
  const fromRate = CURRENCIES[from]?.rate || 1;
  const toRate = CURRENCIES[to]?.rate || 1;
  const converted = (parseFloat(amount) / fromRate) * toRate;
  
  res.json({
    amount: parseFloat(amount),
    from: { code: from, symbol: CURRENCIES[from]?.symbol || '$' },
    to: { code: to, symbol: CURRENCIES[to]?.symbol || '$' },
    converted: Math.round(converted * 100) / 100
  });
});

module.exports = router;
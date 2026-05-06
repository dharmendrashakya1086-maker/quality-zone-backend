const axios = require('axios');

const CURRENCIES = {
  'USD': { symbol: '$', rate: 1, name: 'US Dollar' },
  'EUR': { symbol: '€', rate: 0.92, name: 'Euro' },
  'GBP': { symbol: '£', rate: 0.79, name: 'British Pound' },
  'INR': { symbol: '₹', rate: 83.5, name: 'Indian Rupee' },
  'AUD': { symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
  'CAD': { symbol: 'C$', rate: 1.38, name: 'Canadian Dollar' },
  'JPY': { symbol: '¥', rate: 151.2, name: 'Japanese Yen' },
  'SGD': { symbol: 'S$', rate: 1.35, name: 'Singapore Dollar' },
  'AED': { symbol: 'د.إ', rate: 3.67, name: 'UAE Dirham' },
  'SAR': { symbol: 'ر.س', rate: 3.75, name: 'Saudi Riyal' }
};

const COUNTRIES = {
  'US': { name: 'United States', currency: 'USD', flag: '🇺🇸' },
  'GB': { name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  'IN': { name: 'India', currency: 'INR', flag: '🇮🇳' },
  'AU': { name: 'Australia', currency: 'AUD', flag: '🇦🇺' },
  'CA': { name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  'JP': { name: 'Japan', currency: 'JPY', flag: '🇯🇵' },
  'SG': { name: 'Singapore', currency: 'SGD', flag: '🇸🇬' },
  'AE': { name: 'United Arab Emirates', currency: 'AED', flag: '🇦🇪' },
  'SA': { name: 'Saudi Arabia', currency: 'SAR', flag: '🇸🇦' },
  'DE': { name: 'Germany', currency: 'EUR', flag: '🇩🇪' },
  'FR': { name: 'France', currency: 'EUR', flag: '🇫🇷' },
  'IT': { name: 'Italy', currency: 'EUR', flag: '🇮🇹' }
};

let exchangeRates = CURRENCIES;

async function updateExchangeRates() {
  try {
    const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
    const rates = response.data.rates;
    
    Object.keys(CURRENCIES).forEach(currency => {
      if (rates[currency]) CURRENCIES[currency].rate = rates[currency];
    });
    exchangeRates = CURRENCIES;
  } catch (error) {
    console.log('Using cached rates');
  }
}

setInterval(updateExchangeRates, 2 * 60 * 60 * 1000);
updateExchangeRates();

module.exports = { CURRENCIES: exchangeRates, COUNTRIES };
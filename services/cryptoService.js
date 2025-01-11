const axios = require("axios");
const Crypto = require("../models/crypto");
const { coingeckoBaseURL } = require("../config");

const coins = ["bitcoin", "matic-network", "ethereum"];

async function fetchCryptoData() {
  try {
    for (const coin of coins) {
      const response = await axios.get(`${coingeckoBaseURL}/coins/markets`, {
        params: { vs_currency: "usd", ids: coin },
      });
      const { current_price, market_cap, price_change_percentage_24h } =
        response.data[0];

      // Store data in MongoDB
      await Crypto.create({
        coin,
        price: current_price,
        marketCap: market_cap,
        change24h: price_change_percentage_24h,
      });
    }
    console.log("Data fetched and stored successfully.");
  } catch (err) {
    console.error("Error fetching data:", err.message);
  }
}

async function getLatestStats(coin) {
  return await Crypto.findOne({ coin }).sort({ timestamp: -1 }).select("-_id -__v");
}

async function getPriceStandardDeviation(coin) {
  const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);
  if (!records.length) return null;

  const prices = records.map((record) => record.price);
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  const variance =
    prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) /
    prices.length;

  return Math.sqrt(variance);
}

module.exports = {
  fetchCryptoData,
  getLatestStats,
  getPriceStandardDeviation,
};

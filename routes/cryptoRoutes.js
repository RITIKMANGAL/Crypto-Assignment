const express = require("express");
const router = express.Router();
const { getLatestStats, getPriceStandardDeviation } = require("../services/cryptoService");

// /stats API
router.get("/stats", async (req, res) => {
  const { coin } = req.query;
  if (!coin) return res.status(400).json({ error: "Coin parameter is required" });

  try {
    const stats = await getLatestStats(coin);
    if (!stats) return res.status(404).json({ error: "No data found for the requested coin" });
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// /deviation API
router.get("/deviation", async (req, res) => {
  const { coin } = req.query;
  if (!coin) return res.status(400).json({ error: "Coin parameter is required" });

  try {
    const deviation = await getPriceStandardDeviation(coin);
    if (deviation === null) return res.status(404).json({ error: "Insufficient data for calculation" });
    res.json({ deviation: deviation.toFixed(2) });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

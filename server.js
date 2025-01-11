const express = require("express");
const mongoose = require("mongoose");
const cron = require("node-cron");
const { fetchCryptoData } = require("./services/cryptoService");
const cryptoRoutes = require("./routes/cryptoRoutes");
const { mongoURI } = require("./config");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", cryptoRoutes);

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// Schedule background job every 2 hours
cron.schedule("0 */2 * * *", fetchCryptoData);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const personRoutes = require("./routes/persons");
const attendanceRoutes = require("./routes/attendance");
const serviceRoutes = require("./routes/services");

require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://uec-app.vercel.app", // Deployed frontend
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/persons", personRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/services", serviceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

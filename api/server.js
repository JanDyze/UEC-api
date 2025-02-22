require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const personsRoutes = require("./routes/persons");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/persons", personsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

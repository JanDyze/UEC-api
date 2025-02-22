const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Data storage files
const DATA_DIR = path.join(__dirname, "data");
const PERSONS_FILE = path.join(DATA_DIR, "persons.json");
const SERVICES_FILE = path.join(DATA_DIR, "services.json");
const ATTENDANCE_FILE = path.join(DATA_DIR, "attendance.json");

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(PERSONS_FILE)) fs.writeFileSync(PERSONS_FILE, "[]");
if (!fs.existsSync(SERVICES_FILE)) fs.writeFileSync(SERVICES_FILE, "[]");
if (!fs.existsSync(ATTENDANCE_FILE)) fs.writeFileSync(ATTENDANCE_FILE, "[]");

// Load Routes
const personRoutes = require("./routes/persons");
const serviceRoutes = require("./routes/services");
const attendanceRoutes = require("./routes/attendance");

app.use("/api/persons", personRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

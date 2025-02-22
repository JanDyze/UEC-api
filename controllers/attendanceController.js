const fs = require("fs");
const path = require("path");

const ATTENDANCE_FILE = path.join(__dirname, "../data/attendance.json");

// Function to read attendance data
const readAttendance = () => {
  if (!fs.existsSync(ATTENDANCE_FILE)) return [];
  const data = fs.readFileSync(ATTENDANCE_FILE);
  return JSON.parse(data);
};

// Function to write attendance data
const writeAttendance = (data) => {
  fs.writeFileSync(ATTENDANCE_FILE, JSON.stringify(data, null, 2));
};

// Get all attendance records
const getAllAttendance = (req, res) => {
  try {
    const attendance = readAttendance();
    res.json(attendance);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reading attendance", error: error.message });
  }
};

// Get attendance records by service_id
const getAttendanceByService = (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const attendance = readAttendance();
    const filteredAttendance = attendance.filter(
      (a) => a.service_id === serviceId
    );
    res.json(filteredAttendance);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering attendance", error: error.message });
  }
};

// Create a new attendance record
const createAttendance = (req, res) => {
  try {
    const { service_id, person_id, status } = req.body;
    if (!service_id || !person_id || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const attendance = readAttendance();
    const newRecord = { id: Date.now(), service_id, person_id, status };
    attendance.push(newRecord);
    writeAttendance(attendance);

    res.status(201).json(newRecord);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating attendance", error: error.message });
  }
};

// Update an existing attendance record (toggle status)
const updateAttendance = (req, res) => {
  try {
    const { service_id, person_id, status } = req.body;
    if (!service_id || !person_id || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const attendance = readAttendance();
    const index = attendance.findIndex(
      (a) => a.service_id === service_id && a.person_id === person_id
    );

    if (index !== -1) {
      attendance[index].status = status;
      writeAttendance(attendance);
      res.json(attendance[index]);
    } else {
      return res.status(404).json({ message: "Attendance record not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating attendance", error: error.message });
  }
};

// Get the total count of persons marked as "Present"
const getAllPresentByService = (req, res) => {
  try {
    const serviceId = parseInt(req.params.serviceId);
    const attendance = readAttendance();
    const presentCount = attendance.filter(
      (a) => a.service_id === serviceId && a.status === "Present"
    ).length;
    res.json({ serviceId, presentCount });
  } catch (error) {
    res.status(500).json({
      message: "Error counting present persons",
      error: error.message,
    });
  }
};

module.exports = {
  getAllAttendance,
  getAttendanceByService,
  createAttendance,
  updateAttendance,
  getAllPresentByService, // Added new function here
};

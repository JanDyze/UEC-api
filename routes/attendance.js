const express = require("express");
const {
  getAllAttendance,
  getAttendanceByService,
  createAttendance,
  updateAttendance,
  getAllPresentByService,
} = require("../controllers/attendanceController");

const router = express.Router();

// Get all attendance records
router.get("/", getAllAttendance);

// Get attendance records for a specific service
router.get("/:serviceId", getAttendanceByService);

// Get the count of all present persons
router.get("/:serviceId/count/present", getAllPresentByService);

// Create a new attendance record
router.post("/", createAttendance);

// Update an existing attendance record
router.put("/", updateAttendance);

module.exports = router;

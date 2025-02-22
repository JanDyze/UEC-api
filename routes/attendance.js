const express = require("express");
const {
  getAttendanceRecords,
  getAttendanceByServiceId,
  setAttendanceByServiceId,
  updateAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/", getAttendanceRecords);
router.get("/service/:serviceId", getAttendanceByServiceId); // Get attendance by service ID
router.post("/service/:serviceId", setAttendanceByServiceId);
router.put("/:id", updateAttendance); // Update attendance status by ID
// Set attendance for a service

module.exports = router;

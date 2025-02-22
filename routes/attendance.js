const express = require("express");
const {
  getAttendanceRecords,
  getAttendanceById,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");

const router = express.Router();

router.get("/", getAttendanceRecords);
router.get("/:id", getAttendanceById);
router.post("/", addAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);

module.exports = router;

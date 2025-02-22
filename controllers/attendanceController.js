const Attendance = require("../models/attendance");
const Person = require("../models/persons"); // Ensure this exists

// Get all attendance records
const getAttendanceRecords = async (req, res) => {
  try {
    const records = await Attendance.find().populate(
      "person_id",
      "firstname lastname"
    );
    res.status(200).json({
      success: true,
      message: "Attendance records retrieved successfully.",
      data: records,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch attendance records." });
  }
};

// Get attendance record by ID
const getAttendanceById = async (req, res) => {
  try {
    const record = await Attendance.findById(req.params.id).populate(
      "person_id",
      "firstname lastname"
    );
    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found." });
    }
    res.status(200).json({
      success: true,
      message: "Attendance record retrieved successfully.",
      data: record,
    });
  } catch (error) {
    console.error("Error fetching attendance record:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch attendance record." });
  }
};

// Add new attendance record
const addAttendance = async (req, res) => {
  try {
    const { date, person_id, status } = req.body;

    if (!date || !person_id || !status) {
      return res.status(400).json({
        success: false,
        message: "Date, person_id, and status are required.",
      });
    }

    // Ensure the person exists
    const personExists = await Person.findById(person_id);
    if (!personExists) {
      return res
        .status(404)
        .json({ success: false, message: "Person not found." });
    }

    const newAttendance = await Attendance.create({ date, person_id, status });

    // Populate person_id field before sending response
    const populatedAttendance = await newAttendance.populate(
      "person_id",
      "firstname lastname"
    );

    res.status(201).json({
      success: true,
      message: "Attendance record added successfully.",
      data: populatedAttendance,
    });
  } catch (error) {
    console.error("Error adding attendance record:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add attendance record." });
  }
};

// Update an attendance record
const updateAttendance = async (req, res) => {
  try {
    const { date, status } = req.body;

    const updatedRecord = await Attendance.findByIdAndUpdate(
      req.params.id,
      { date, status },
      { new: true }
    );

    if (!updatedRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found." });
    }

    res.status(200).json({
      success: true,
      message: "Attendance record updated successfully.",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating attendance record:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update attendance record." });
  }
};

// Delete an attendance record
const deleteAttendance = async (req, res) => {
  try {
    const deletedRecord = await Attendance.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance record not found." });
    }

    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete attendance record." });
  }
};

module.exports = {
  getAttendanceRecords,
  getAttendanceById,
  addAttendance,
  updateAttendance,
  deleteAttendance,
};

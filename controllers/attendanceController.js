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

// Get attendance records by service ID
const getAttendanceByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params; // Ensure this matches the route param in your frontend
    console.log("Fetching attendance for service ID:", serviceId); // Debugging log

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: "Service ID is required.",
      });
    }

    const records = await Attendance.find({ service_id: serviceId }).populate(
      "person_id",
      "firstname lastname"
    );

    if (!records.length) {
      return res.status(404).json({
        success: false,
        message: `No attendance records found for service ID ${serviceId}.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Attendance records for service ${serviceId} retrieved successfully.`,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching attendance records by service ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance records.",
      error: error.message,
    });
  }
};

// Set attendance by service ID (register all persons as absent first)
const setAttendanceByServiceId = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const persons = await Person.find(); // Get all persons

    if (!persons.length) {
      console.log("No persons found.");
      return res.status(400).json({
        success: false,
        message: "No persons found to initialize attendance.",
      });
    }

    // Find existing attendance records for the service
    const existingAttendance = await Attendance.find({ service_id: serviceId });

    // Create a Set of existing person_id values to avoid duplicates
    const existingPersonIds = new Set(
      existingAttendance.map((record) => record.person_id.toString())
    );

    // Filter out persons who already have an attendance record for this service
    const newAttendanceRecords = persons
      .filter((person) => !existingPersonIds.has(person._id.toString()))
      .map((person) => ({
        service_id: serviceId,
        person_id: person._id,
        status: "Absent",
      }));

    if (!newAttendanceRecords.length) {
      return res.status(200).json({
        success: true,
        message: "Attendance already initialized. No new records added.",
      });
    }

    // Insert only new records
    const insertedRecords = await Attendance.insertMany(newAttendanceRecords);
    console.log("Inserted Attendance Records:", insertedRecords);

    res.status(201).json({
      success: true,
      message: "New attendance records initialized.",
      data: insertedRecords,
    });
  } catch (error) {
    console.error("Error in setAttendanceByServiceId:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initialize attendance.",
      error: error.message,
    });
  }
};

// Update attendance status by record ID
const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params; // Get attendance record ID
    const { status } = req.body; // Get new status from request body

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required.",
      });
    }

    // Update attendance record
    const updatedRecord = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    ).populate("person_id", "firstname lastname");

    if (!updatedRecord) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance record updated successfully.",
      data: updatedRecord,
    });
  } catch (error) {
    console.error("Error updating attendance record:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update attendance record.",
      error: error.message,
    });
  }
};

module.exports = {
  getAttendanceRecords,
  getAttendanceByServiceId,
  setAttendanceByServiceId,
  updateAttendance,
};

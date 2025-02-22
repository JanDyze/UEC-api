const Service = require("../models/services");

// Get all services
const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({
      success: true,
      message: "Services retrieved successfully.",
      data: services,
    });
  } catch (err) {
    console.error("❌ Error fetching services:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch services.",
    });
  }
};

// Get a service by ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service retrieved successfully.",
      data: service,
    });
  } catch (err) {
    console.error("❌ Error fetching service by ID:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch service.",
    });
  }
};

// Add a new service
const addService = async (req, res) => {
  try {
    const { date, type_of_event } = req.body;

    if (!date || !type_of_event) {
      return res.status(400).json({
        success: false,
        message: "Date and type_of_event are required.",
      });
    }

    const service = new Service(req.body);
    await service.save();

    res.status(201).json({
      success: true,
      message: "Service added successfully.",
      data: service,
    });
  } catch (err) {
    console.error("❌ Error adding service:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add service.",
    });
  }
};

// Delete a service
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Service deleted successfully!",
    });
  } catch (err) {
    console.error("❌ Error deleting service:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete service.",
    });
  }
};

module.exports = { getServices, getServiceById, addService, deleteService };

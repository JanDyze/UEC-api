const fs = require("fs");
const path = require("path");

const SERVICES_FILE = path.join(__dirname, "../data/services.json");

// Function to read services data
const readServices = () => {
  const data = fs.readFileSync(SERVICES_FILE);
  return JSON.parse(data);
};

// Function to write services data
const writeServices = (data) => {
  fs.writeFileSync(SERVICES_FILE, JSON.stringify(data, null, 2));
};

// Get all services
const getServices = (req, res) => {
  try {
    const services = readServices();
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reading services", error: error.message });
  }
};

// Get service by ID
const getServiceById = (req, res) => {
  try {
    const services = readServices();
    const service = services.find((s) => s.id === parseInt(req.params.id));

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reading service", error: error.message });
  }
};

// Add a new service
const addService = (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const services = readServices();

    const newService = {
      id: services.length ? services[services.length - 1].id + 1 : 1,
      date,
    };

    services.push(newService);
    writeServices(services);

    res
      .status(201)
      .json({ message: "Service added successfully", service: newService });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding service", error: error.message });
  }
};

// Update a service
const updateService = (req, res) => {
  try {
    const { date } = req.body;
    const services = readServices();
    const index = services.findIndex((s) => s.id === parseInt(req.params.id));

    if (index === -1) {
      return res.status(404).json({ message: "Service not found" });
    }

    services[index].date = date || services[index].date;
    writeServices(services);

    res.json({
      message: "Service updated successfully",
      service: services[index],
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service", error: error.message });
  }
};

// Delete a service
const deleteService = (req, res) => {
  try {
    let services = readServices();
    const filteredServices = services.filter(
      (s) => s.id !== parseInt(req.params.id)
    );

    if (services.length === filteredServices.length) {
      return res.status(404).json({ message: "Service not found" });
    }

    writeServices(filteredServices);

    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service", error: error.message });
  }
};

// Export functions
module.exports = {
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService,
};

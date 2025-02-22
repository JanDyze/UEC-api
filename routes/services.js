const express = require("express");
const {
  getServices,
  addService,
  updateService,
  deleteService,
  getServiceById,
} = require("../controllers/serviceController");

const router = express.Router();

// Route to get all services
router.get("/", getServices);
router.get("/:id", getServiceById);

// Route to add a new service
router.post("/add", addService);

// Route to update a service
router.put("/:id", updateService);

// Route to delete a service
router.delete("/:id", deleteService);

module.exports = router;

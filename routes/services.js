const express = require("express");
const {
  getServices,
  getServiceById, // Add this
  addService,
  deleteService,
} = require("../controllers/serviceController");

const router = express.Router();

router.get("/", getServices); // Get all services
router.get("/:id", getServiceById); // Get a service by ID
router.post("/", addService); // Add a new service
router.delete("/:id", deleteService); // Delete a service by ID

module.exports = router;

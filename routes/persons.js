const express = require("express");
const {
  addPerson,
  getPersons,
  updatePerson,
  deletePerson,
  getPersonById,
} = require("../controllers/personController");

const router = express.Router();

// Route to get all persons
router.get("/", getPersons);

router.get("/:id", getPersonById);

// Route to add a new person
router.post("/add", addPerson);

// Route to update a person by ID
router.put("/:id", updatePerson);

// Route to delete a person by ID
router.delete("/:id", deletePerson);

module.exports = router;

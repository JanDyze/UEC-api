const express = require("express");
const {
  getPersons,
  getPersonById, // ✅ Import getPersonById
  addPerson,
  deletePerson,
} = require("../controllers/personController");

const router = express.Router();

router.get("/", getPersons);
router.get("/:id", getPersonById); // ✅ New GET route for fetching a person by ID
router.post("/", addPerson);
router.delete("/:id", deletePerson);

module.exports = router;

const express = require("express");
const {
  getPersons,
  addPerson,
  deletePerson,
} = require("../controllers/personController");

const router = express.Router();

router.get("/", getPersons);
router.post("/", addPerson);
router.delete("/:id", deletePerson); // ✅ Added DELETE route

module.exports = router;

const Person = require("../models/persons");

// Get all persons
const getPersons = async (req, res) => {
  try {
    const persons = await Person.find();
    res.status(200).json({
      success: true,
      message: "Persons retrieved successfully.",
      data: persons,
    });
  } catch (err) {
    console.error("❌ Error fetching persons:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch persons.",
    });
  }
};

// ✅ Get a person by ID
const getPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findById(id);

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Person not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Person retrieved successfully.",
      data: person,
    });
  } catch (err) {
    console.error("❌ Error fetching person:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch person.",
    });
  }
};

// Add a new person
const addPerson = async (req, res) => {
  try {
    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
      return res.status(400).json({
        success: false,
        message: "Firstname and lastname are required.",
      });
    }

    const person = new Person(req.body);
    await person.save();

    res.status(201).json({
      success: true,
      message: "Person added successfully.",
      data: person,
    });
  } catch (err) {
    console.error("❌ Error adding person:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add person.",
    });
  }
};

// Delete a person
const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await Person.findByIdAndDelete(id);

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Person not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Person deleted successfully!",
    });
  } catch (err) {
    console.error("❌ Error deleting person:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete person.",
    });
  }
};

module.exports = { getPersons, getPersonById, addPerson, deletePerson };

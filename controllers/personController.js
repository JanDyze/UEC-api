const fs = require("fs");
const path = require("path");

const PERSONS_FILE = path.join(__dirname, "../data/persons.json");

// Function to read JSON data
const readPersons = () => {
  if (!fs.existsSync(PERSONS_FILE)) return [];
  const data = fs.readFileSync(PERSONS_FILE, "utf-8");
  return data ? JSON.parse(data) : [];
};

// Function to write JSON data
const writePersons = (data) => {
  fs.writeFileSync(PERSONS_FILE, JSON.stringify(data, null, 2));
};

// ✅ Get all persons
exports.getPersons = (req, res) => {
  try {
    const persons = readPersons();
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Add a new person
exports.addPerson = (req, res) => {
  try {
    const {
      firstname,
      lastname,
      address,
      birthday,
      is_member,
      gender,
      nickname,
      phone,
      facebook,
    } = req.body;

    if (!firstname || !lastname) {
      return res
        .status(400)
        .json({ message: "Firstname and lastname are required" });
    }

    const persons = readPersons();

    const newPerson = {
      id: persons.length ? persons[persons.length - 1].id + 1 : 1,
      firstname,
      lastname,
      address: address || "",
      birthday: birthday || "",
      is_member: is_member || false,
      gender: gender || "",
      nickname: nickname || "",
      phone: phone || "",
      facebook: facebook || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    persons.push(newPerson);
    writePersons(persons);

    res
      .status(201)
      .json({ message: "Person added successfully", person: newPerson });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Update a person by ID
exports.updatePerson = (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    let persons = readPersons();
    const index = persons.findIndex((p) => p.id === parseInt(id));

    if (index === -1) {
      return res.status(404).json({ message: "Person not found" });
    }

    persons[index] = {
      ...persons[index],
      ...updatedData,
      updated_at: new Date().toISOString(),
    };
    writePersons(persons);

    res
      .status(200)
      .json({ message: "Person updated successfully", person: persons[index] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Delete a person by ID
exports.deletePerson = (req, res) => {
  try {
    const { id } = req.params;

    let persons = readPersons();
    const filteredPersons = persons.filter((p) => p.id !== parseInt(id));

    if (persons.length === filteredPersons.length) {
      return res.status(404).json({ message: "Person not found" });
    }

    writePersons(filteredPersons);

    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getPersonById = (req, res) => {
  try {
    const { id } = req.params;
    const persons = readPersons();
    const person = persons.find((p) => p.id === parseInt(id));

    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

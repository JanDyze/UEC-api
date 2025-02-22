require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  // Watch MongoDB for changes
  const changeStream = mongoose.connection.collection("persons").watch();
  changeStream.on("change", (change) => {
    console.log("Change detected:", change);
  });
});

// **Define Person Model** (Fixes the error)
const PersonSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
});
const Person = mongoose.model("Person", PersonSchema);

// API to add a person
app.post("/persons", async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();
    res.json(person);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to get persons
app.get("/persons", async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export for Vercel
module.exports = app;

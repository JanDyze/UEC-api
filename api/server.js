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

// Define Schema and Model
const PersonSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
});

const Person = mongoose.model("Person", PersonSchema);

// API to add person
app.post("/persons", async (req, res) => {
  const person = new Person(req.body);
  await person.save();
  res.json(person);
});

// API to get persons
app.get("/persons", async (req, res) => {
  const persons = await Person.find();
  res.json(persons);
});

// Export as a serverless function
module.exports = app;

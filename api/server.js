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

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
  watchCollection(); // Start watching MongoDB changes
});

// Define Schema and Model
const PersonSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
});

const Person = mongoose.model("Person", PersonSchema);

// Store connected clients
let clients = [];

// SSE Route (Real-time updates)
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  clients.push(res);
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

// Function to notify clients
const notifyClients = () => {
  clients.forEach((client) => client.write(`data: update\n\n`));
};

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

// API to get all persons
app.get("/persons", async (req, res) => {
  const persons = await Person.find();
  res.json(persons);
});

// **Watch MongoDB Collection for Changes**
const watchCollection = () => {
  const changeStream = Person.watch();

  changeStream.on("change", (change) => {
    console.log("Change detected:", change);
    notifyClients(); // Notify all clients when a change happens
  });
};

module.exports = app;

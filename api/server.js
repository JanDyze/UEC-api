require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (adjust as needed)
  },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Schema and Model
const PersonSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
});

const Person = mongoose.model("Person", PersonSchema);

// API to add person & notify clients
app.post("/persons", async (req, res) => {
  try {
    const person = new Person(req.body);
    await person.save();

    io.emit("update"); // Notify all connected clients
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

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("A client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// Export for Vercel (but listen locally)
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

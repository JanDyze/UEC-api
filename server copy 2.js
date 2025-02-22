require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://dyze-app.com:5173"], // Allow both URLs
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas using environment variable
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
  io.emit("update"); // Notify clients
  res.send(person);
});

// API to get persons
app.get("/persons", async (req, res) => {
  const persons = await Person.find();
  res.send(persons);
});

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("Client connected");
  socket.on("disconnect", () => console.log("Client disconnected"));
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

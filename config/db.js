const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Watch MongoDB for changes
    const changeStream = mongoose.connection.collection("persons").watch();
    changeStream.on("change", (change) => {
      console.log("Change detected:", change);
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;

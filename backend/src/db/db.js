const mongoose = require("mongoose");

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
}

module.exports = connectDB;
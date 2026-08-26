require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

let dbConnected = false;

async function handler(req, res) {
  try {
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }

    return app(req, res);
  } catch (error) {
    console.error(
      "Server initialization error:",
      error.message
    );

    return res.status(500).json({
      message: "Server initialization failed",
      error: error.message,
    });
  }
}

module.exports = handler;
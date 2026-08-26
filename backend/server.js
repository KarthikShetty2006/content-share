require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/db/db");

async function handler(req, res) {
  try {
    await connectDB();

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
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ======================================================
// REGISTER CREATOR
// ======================================================

async function registerFoodPartner(req, res) {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      contactName,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !contactName
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check existing account
    const isAccountAlreadyExists =
      await foodPartnerModel.findOne({
        email,
      });

    if (isAccountAlreadyExists) {
      return res.status(400).json({
        message: "Creator account already exists",
      });
    }

    // Check phone number
    const isPhoneAlreadyExists =
      await foodPartnerModel.findOne({
        phone,
      });

    if (isPhoneAlreadyExists) {
      return res.status(400).json({
        message:
          "An account with this phone number already exists",
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create account
    const foodPartner =
      await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName,
      });

    // Create JWT
    const token = jwt.sign(
      {
        id: foodPartner._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message:
        "Creator account registered successfully",

      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        contactName: foodPartner.contactName,
        phone: foodPartner.phone,
        address: foodPartner.address,
      },
    });
  } catch (error) {
    console.error(
      "Error registering creator:",
      error
    );

    // MongoDB duplicate key
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Email or phone number already exists",
      });
    }

    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
}


// ======================================================
// LOGIN CREATOR
// ======================================================

async function loginFoodPartner(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find creator
    const foodPartner =
      await foodPartnerModel.findOne({
        email,
      });

    if (!foodPartner) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const isPasswordValid =
      await bcrypt.compare(
        password,
        foodPartner.password
      );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: foodPartner._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store JWT in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Logged in successfully",

      foodPartner: {
        _id: foodPartner._id,
        email: foodPartner.email,
        name: foodPartner.name,
        contactName: foodPartner.contactName,
        phone: foodPartner.phone,
        address: foodPartner.address,
      },
    });
  } catch (error) {
    console.error(
      "Error logging in creator:",
      error
    );

    return res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
}


// ======================================================
// LOGOUT CREATOR
// ======================================================

function logoutFoodPartner(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
}


// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  registerFoodPartner,
  loginFoodPartner,
  logoutFoodPartner,
};
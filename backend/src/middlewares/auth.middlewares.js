const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");


// ======================================================
// CREATOR AUTHENTICATION
// ======================================================

async function authFoodPartnerMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Please log in first",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const foodPartner =
      await foodPartnerModel.findById(decoded.id);

    if (!foodPartner) {
      return res.status(401).json({
        message: "Creator account not found",
      });
    }

    // Make creator available to controllers
    req.foodPartner = foodPartner;

    next();
  } catch (error) {
    console.error(
      "Creator authentication error:",
      error
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}


module.exports = {
  authFoodPartnerMiddleware,
};
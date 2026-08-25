const express = require("express");

const authController = require("../controller/auth.controller");

const router = express.Router();


// ======================================================
// CONTENT SHARE AUTHENTICATION
// ======================================================

// Register Creator
router.post(
  "/food-partner/register",
  authController.registerFoodPartner
);

// Login Creator
router.post(
  "/food-partner/login",
  authController.loginFoodPartner
);

// Logout Creator
router.get(
  "/food-partner/logout",
  authController.logoutFoodPartner
);


module.exports = router;
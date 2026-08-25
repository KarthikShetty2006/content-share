const express = require("express");

const router = express.Router();

const foodPartnerController = require("../controller/food-partner.controller");

const authMiddleware = require("../middlewares/auth.middlewares");


// My profile
router.get(
  "/profile",
  authMiddleware.authFoodPartnerMiddleware,
  foodPartnerController.getMyProfile
);


// Update my profile
router.put(
  "/profile",
  authMiddleware.authFoodPartnerMiddleware,
  foodPartnerController.updateMyProfile
);


// View a creator profile
router.get(
  "/:id",
  authMiddleware.authFoodPartnerMiddleware,
  foodPartnerController.getFoodPartnerById
);


module.exports = router;
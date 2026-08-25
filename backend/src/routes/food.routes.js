const express = require("express");

const router = express.Router();

const foodController = require("../controller/food.controller");

const authMiddleware = require("../middlewares/auth.middlewares");

const multer = require("multer");


// ======================================================
// MULTER
// ======================================================

const upload = multer({
  storage: multer.memoryStorage(),
});


// ======================================================
// CREATE CONTENT
// POST /api/food
// ======================================================

router.post(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  upload.single("video"),
  foodController.createFood
);


// ======================================================
// GET ALL CONTENT
// GET /api/food
// ======================================================

router.get(
  "/",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.getFoodItems
);


// ======================================================
// LIKE / UNLIKE
// POST /api/food/like
// ======================================================

router.post(
  "/like",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.likeFood
);


// ======================================================
// SAVE / UNSAVE
// POST /api/food/save
// ======================================================

router.post(
  "/save",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.saveFood
);


// ======================================================
// ADD COMMENT
// POST /api/food/comment
// ======================================================

router.post(
  "/comment",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.addComment
);


// ======================================================
// GET SAVED CONTENT
// GET /api/food/saved
// ======================================================

router.get(
  "/saved",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.getSavedFoodItems
);


// ======================================================
// GET COMMENTS
// GET /api/food/comments/:foodId
// ======================================================

router.get(
  "/comments/:foodId",
  authMiddleware.authFoodPartnerMiddleware,
  foodController.getComments
);


module.exports = router;
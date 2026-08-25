const foodModel = require("../models/food.model");
const likeModel = require("../models/likes.model");
const saveModel = require("../models/save.model");
const commentModel = require("../models/comment.model");

const { uploadFile } = require("../services/storage.service");
const { v4: uuid } = require("uuid");


// ======================================================
// CREATE CONTENT
// ======================================================

async function createFood(req, res) {
  try {
    const fileUploadResult = await uploadFile(
      req.file.buffer,
      uuid()
    );

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult,
      foodPartner: req.foodPartner._id,
    });

    return res.status(201).json({
      message: "Content created successfully",
      food: foodItem,
    });
  } catch (error) {
    console.error("Error creating content:", error);

    return res.status(500).json({
      message: "Failed to create content",
      error: error.message,
    });
  }
}


// ======================================================
// GET ALL CONTENT
// ======================================================

async function getFoodItems(req, res) {
  try {
    const foodItems = await foodModel
      .find({})
      .populate(
        "foodPartner",
        "name email contactName phone address"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Content fetched successfully",
      foodItems,
    });
  } catch (error) {
    console.error("Error fetching content:", error);

    return res.status(500).json({
      message: "Failed to fetch content",
      error: error.message,
    });
  }
}


// ======================================================
// LIKE / UNLIKE CONTENT
// ======================================================

async function likeFood(req, res) {
  try {
    const { foodId } = req.body;
    const foodPartner = req.foodPartner;

    if (!foodId) {
      return res.status(400).json({
        message: "Content ID is required",
      });
    }

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Content not found",
      });
    }

    const isAlreadyLiked = await likeModel.findOne({
      foodPartner: foodPartner._id,
      food: foodId,
    });

    // ------------------------------------------
    // UNLIKE
    // ------------------------------------------

    if (isAlreadyLiked) {
      await likeModel.deleteOne({
        foodPartner: foodPartner._id,
        food: foodId,
      });

      await foodModel.findByIdAndUpdate(foodId, {
        $inc: {
          likeCount: -1,
        },
      });

      return res.status(200).json({
        message: "Content unliked successfully",
        like: false,
      });
    }

    // ------------------------------------------
    // LIKE
    // ------------------------------------------

    const like = await likeModel.create({
      foodPartner: foodPartner._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: {
        likeCount: 1,
      },
    });

    return res.status(201).json({
      message: "Content liked successfully",
      like: true,
    });
  } catch (error) {
    console.error("Error liking content:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}


// ======================================================
// SAVE / UNSAVE CONTENT
// ======================================================

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const foodPartner = req.foodPartner;

    if (!foodId) {
      return res.status(400).json({
        message: "Content ID is required",
      });
    }

    const food = await foodModel.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Content not found",
      });
    }

    const isAlreadySaved = await saveModel.findOne({
      foodPartner: foodPartner._id,
      food: foodId,
    });

    // ------------------------------------------
    // UNSAVE
    // ------------------------------------------

    if (isAlreadySaved) {
      await saveModel.deleteOne({
        foodPartner: foodPartner._id,
        food: foodId,
      });

      await foodModel.findByIdAndUpdate(foodId, {
        $inc: {
          saveCount: -1,
        },
      });

      return res.status(200).json({
        message: "Content unsaved successfully",
        save: false,
      });
    }

    // ------------------------------------------
    // SAVE
    // ------------------------------------------

    const save = await saveModel.create({
      foodPartner: foodPartner._id,
      food: foodId,
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: {
        saveCount: 1,
      },
    });

    return res.status(201).json({
      message: "Content saved successfully",
      save: true,
      save,
    });
  } catch (error) {
    console.error("Error saving content:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}


// ======================================================
// GET SAVED CONTENT
// ======================================================

async function getSavedFoodItems(req, res) {
  try {
    const foodPartner = req.foodPartner;

    const savedFoods = await saveModel
      .find({
        foodPartner: foodPartner._id,
      })
      .populate({
        path: "food",
        populate: {
          path: "foodPartner",
          select: "name email contactName",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Saved content retrieved successfully",
      savedFoods,
    });
  } catch (error) {
    console.error("Error getting saved content:", error);

    return res.status(500).json({
      message: "Error retrieving saved content",
      error: error.message,
    });
  }
}


// ======================================================
// ADD COMMENT
// ======================================================

async function addComment(req, res) {
  try {
    const { foodId, commentText } = req.body;
    const foodPartner = req.foodPartner;

    if (!foodId || !commentText || !commentText.trim()) {
      return res.status(400).json({
        message: "Content ID and comment text are required",
      });
    }

    const foodExists = await foodModel.findById(foodId);

    if (!foodExists) {
      return res.status(404).json({
        message: "Content not found",
      });
    }

    const comment = await commentModel.create({
      foodPartner: foodPartner._id,
      food: foodId,
      comment: commentText.trim(),
    });

    await foodModel.findByIdAndUpdate(foodId, {
      $inc: {
        commentCount: 1,
      },
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);

    return res.status(500).json({
      message: "Server error while adding comment",
      error: error.message,
    });
  }
}


// ======================================================
// GET COMMENTS
// ======================================================

async function getComments(req, res) {
  try {
    const { foodId } = req.params;

    const comments = await commentModel
      .find({
        food: foodId,
      })
      .populate(
        "foodPartner",
        "name email contactName"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      message: "Comments retrieved successfully",
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);

    return res.status(500).json({
      message: "Error retrieving comments",
      error: error.message,
    });
  }
}


module.exports = {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSavedFoodItems,
  addComment,
  getComments,
};
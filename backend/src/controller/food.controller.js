const foodModel = require('../models/food.model');
const likeModel=require('../models/likes.model')
const saveModel=require('../models/save.model')
const commentModel=require('../models/comment.model')
const { uploadFile } = require('../services/storage.service');
const { v4: uuid } = require('uuid');

async function createFood(req, res) {
  try {
    const fileUploadResult = await uploadFile(req.file.buffer, uuid());

    const foodItem = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      video: fileUploadResult, // ✅ fixed
      foodPartner: req.foodPartner._id
    });

    res.status(201).json({
      message: "Content created successfully",
      food: foodItem
    });
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: "Failed to create content", details: err.message });
  }
}

async function getFoodItems(req,res) {
  const foodItems=await foodModel.find({})
   res.status(200).json({message:"food items fetched successfully",foodItems})
}

async function likeFood(req,res) {
  const {foodId}=req.body;
  const user=req.user;
  const isAlreadyLiked=await likeModel.findOne({user:user._id,food:foodId})
  if(isAlreadyLiked){
    await likeModel.deleteOne({
      user:user._id,food:foodId
    })
    await foodModel.findByIdAndUpdate(foodId,{
      $inc:{likeCount:-1}
    })
    return res.status(200).json({message:"food unliked succesfully"})
  }
  const like=await likeModel.create({
    user:user._id,
    food:foodId
  })
  await foodModel.findByIdAndUpdate(foodId,{
      $inc:{likeCount:1}
    })
  res.status(201).json({message:"food liked successfully",
    like
  })
}

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const user = req.user;

    if (!foodId) {
      return res.status(400).json({ message: "ContentId is required" });
    }

    // Check if already saved
    const isAlreadySaved = await saveModel.findOne({ user: user._id, food: foodId });

    if (isAlreadySaved) {
      await saveModel.deleteOne({ user: user._id, food: foodId });
      await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: -1 } });
      return res.status(200).json({ message: "Food unsaved successfully", save: false });
    }

    // Create new save record
    const save = await saveModel.create({ user: user._id, food: foodId });
    await foodModel.findByIdAndUpdate(foodId, { $inc: { saveCount: 1 } });

    res.status(201).json({ message: "Food saved successfully", save: true, save });
  } catch (err) {
    console.error("Error in saveFood:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getSavedFoodItems(req, res) {
  try {
    const user = req.user;
    const savedFoods = await saveModel.find({ user: user._id }).populate('food');
    if(!savedFoods||savedFoods.length===0){
      return res.status(404).json({ message: "No saved food items found"});
    }
    return res.status(200).json({ message: " saved food items retrived successfully",savedFoods})
  }catch(error){
    res.status(500).json({message:"error",error})
  }
}

async function addComment(req, res) {
  try {
    const { foodId, commentText } = req.body;
    const user = req.user;

    // ✅ Validate required fields
    if (!foodId || !commentText.trim()) {
      return res.status(400).json({ message: "Food ID and comment text are required" });
    }

    // ✅ Check if food exists (optional but safer)
    const foodExists = await foodModel.findById(foodId);
    if (!foodExists) {
      return res.status(404).json({ message: "Food not found" });
    }

    // ✅ Create the new comment
    const comment = await commentModel.create({
      user: user._id,
      food: foodId,
      comment: commentText.trim(),
    });

    // ✅ Increment comment count (optional)
    await foodModel.findByIdAndUpdate(foodId, {
      $inc: { commentCount: 1 },
    });

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ message: "Server error while adding comment" });
  }
}



async function getComments(req, res) {
  try {
    const { foodId } = req.params; // food ID
    console.log("Fetching comments for food ID:", foodId);
    const comments = await commentModel
      .find({ food: foodId })
      .populate('user', 'fullName email') // populate user info
       // latest first
      console.log("Fetched comments:", comments);
    // ✅ Always return 200, even if empty
    return res.status(200).json({
      message: "Comments retrieved successfully",
      comments: comments || [],
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      message: "Error retrieving comments",
      error,
    });
  }
}


module.exports = { createFood,getFoodItems,likeFood,saveFood ,getSavedFoodItems,addComment,getComments};

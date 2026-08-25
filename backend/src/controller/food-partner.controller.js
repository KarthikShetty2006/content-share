const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model");

// ======================================================
// GET CREATOR PROFILE BY ID
// Used when viewing another creator's profile
// ======================================================

async function getFoodPartnerById(req, res) {
  try {
    const foodPartnerId = req.params.id;

    const foodPartner =
      await foodPartnerModel.findById(foodPartnerId);

    if (!foodPartner) {
      return res.status(404).json({
        message: "Creator not found",
      });
    }

    const foodItemsByFoodPartner =
      await foodModel
        .find({
          foodPartner: foodPartnerId,
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Creator fetched successfully",

      foodPartner: {
        ...foodPartner.toObject(),
        foodItems: foodItemsByFoodPartner,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching creator:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}


// ======================================================
// GET LOGGED-IN CREATOR PROFILE
// GET /api/food-partner/profile
// ======================================================

async function getMyProfile(req, res) {
  try {
    const foodPartner =
      await foodPartnerModel.findById(
        req.foodPartner._id
      );

    if (!foodPartner) {
      return res.status(404).json({
        message: "Creator not found",
      });
    }

    const foodItems =
      await foodModel
        .find({
          foodPartner: req.foodPartner._id,
        })
        .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Profile fetched successfully",

      foodPartner: {
        ...foodPartner.toObject(),
        foodItems,
      },
    });
  } catch (error) {
    console.error(
      "Error fetching profile:",
      error
    );

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}


// ======================================================
// UPDATE LOGGED-IN CREATOR PROFILE
// PUT /api/food-partner/profile
// ======================================================

async function updateMyProfile(req, res) {
  try {
    const {
      name,
      contactName,
      phone,
      address,
      email,
    } = req.body;

    // Find the currently logged-in creator
    const foodPartner =
      await foodPartnerModel.findById(
        req.foodPartner._id
      );

    if (!foodPartner) {
      return res.status(404).json({
        message: "Creator not found",
      });
    }

    // Update fields
    foodPartner.name = name;
    foodPartner.contactName = contactName;
    foodPartner.phone = phone;
    foodPartner.address = address;
    foodPartner.email = email;

    await foodPartner.save();

    return res.status(200).json({
      message: "Profile updated successfully",

      foodPartner: {
        _id: foodPartner._id,
        name: foodPartner.name,
        contactName: foodPartner.contactName,
        phone: foodPartner.phone,
        address: foodPartner.address,
        email: foodPartner.email,
      },
    });
  } catch (error) {
    console.error(
      "Error updating profile:",
      error
    );

    // Handle duplicate email / phone
    if (error.code === 11000) {
      return res.status(400).json({
        message:
          "Email or phone number already exists",
      });
    }

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}


module.exports = {
  getFoodPartnerById,
  getMyProfile,
  updateMyProfile,
};
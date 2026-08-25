const mongoose = require("mongoose");

const foodPartnerSchema = new mongoose.Schema(
  {
    // Clerk user ID
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    contactName: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    address: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const foodPartnerModel = mongoose.model(
  "foodpartner",
  foodPartnerSchema
);

module.exports = foodPartnerModel;
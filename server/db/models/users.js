const mongoose = require("mongoose");

const users = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Optional: to ensure unique emails
    },
    password: {
      type: String,
      required: true,
    },
    user_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_types", // Assuming "user_types" is another collection for user roles
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("users", users);

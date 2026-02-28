const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,

  email: {
    type: String,
    unique: true,
  },

  role: {
    type: String,
    enum: ["admin", "specialist", "user"],
    default: "user",
  },

  // 🔥 NEW FIELDS FOR SPECIALIST SYSTEM
  profession: {
    type: String,
  },

  experience: {
    type: Number,
  },

  approvalStatus: {
    type: String,
    enum: ["pending", "approved", "rejected", "none"],
    default: "none", 
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);

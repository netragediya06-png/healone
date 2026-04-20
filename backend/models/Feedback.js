const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
{
  // 🔥 who sent feedback (logged-in user)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // optional subject
  subject: {
    type: String,
  },

  // main message
  message: {
    type: String,
    required: true,
  },

  // 🔥 target
  targetType: {
    type: String,
    enum: ["admin", "specialist"],
    required: true,
  },

  // 🔥 which specialist
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

},
{ timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
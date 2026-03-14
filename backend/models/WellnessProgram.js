const mongoose = require("mongoose");

const wellnessProgramSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String
  },

  specialist: {
    type: String
  },

  durationDays: {
    type: Number
  },

  price: {
    type: Number
  },

  image: {
    type: String
  },

  status: {
    type: Boolean,
    default: true
  },

  approvalStatus: {
    type: String,
    default: "approved"
  },

  level: {
    type: String,
    enum: ["beginner","intermediate","advanced"]
  }

},{timestamps:true});

module.exports = mongoose.model("WellnessProgram",wellnessProgramSchema);
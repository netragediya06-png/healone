const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: String,
  description: String,
  duration: String,
  price: Number,
  specialist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Program", programSchema);
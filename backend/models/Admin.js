const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  photo: String
});

module.exports = mongoose.model("Admin", adminSchema);
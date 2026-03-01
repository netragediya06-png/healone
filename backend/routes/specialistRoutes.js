const express = require("express");
const router = express.Router();

const {
  getApprovedSpecialists,
} = require("../controllers/specialistController");

// Public route (no protect middleware)
router.get("/", getApprovedSpecialists);

module.exports = router;
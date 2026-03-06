const express = require("express");
const router = express.Router();

const {
  getApprovedSpecialists,
} = require("../controllers/specialistController");


// ===============================
// GET APPROVED SPECIALISTS (PUBLIC)
// ===============================
router.get(
  "/",
  getApprovedSpecialists
);


module.exports = router;
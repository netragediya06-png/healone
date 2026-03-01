const express = require("express");
const router = express.Router();

const {
  getAllSpecialists,
  getPendingSpecialists,
  approveSpecialist,
  rejectSpecialist,
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

/* ===============================
   GET ALL SPECIALISTS (ALL STATUS)
=============================== */
router.get(
  "/specialists",
  protect,
  adminOnly,
  getAllSpecialists
);

/* ===============================
   GET ALL PENDING SPECIALISTS
=============================== */
router.get(
  "/specialists/pending",
  protect,
  adminOnly,
  getPendingSpecialists
);

/* ===============================
   APPROVE SPECIALIST
=============================== */
router.put(
  "/specialists/:id/approve",
  protect,
  adminOnly,
  approveSpecialist
);

/* ===============================
   REJECT SPECIALIST
=============================== */
router.put(
  "/specialists/:id/reject",
  protect,
  adminOnly,
  rejectSpecialist
);

module.exports = router;
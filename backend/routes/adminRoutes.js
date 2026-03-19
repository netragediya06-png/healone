const express = require("express");
const router = express.Router();

const {
  getAllSpecialists,
  getPendingSpecialists,
  approveSpecialist,
  rejectSpecialist,
  getSpecialistStats,
  getApprovedSpecialists
} = require("../controllers/adminController");

const { protect, adminOnly } = require("../middleware/authMiddleware");


/* ===============================
   GET ALL APPROVED SPECIALISTS (PUBLIC LIST)
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
   GET ONLY APPROVED (FOR ADMIN VIEW)
=============================== */
router.get(
  "/specialists/approved",
  protect,
  adminOnly,
  getApprovedSpecialists
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


/* ===============================
   SPECIALIST STATS
=============================== */
router.get(
  "/specialists/stats",
  protect,
  adminOnly,
  getSpecialistStats
);
module.exports = router;
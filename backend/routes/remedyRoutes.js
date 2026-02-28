const express = require("express");
const router = express.Router();

const {
  createRemedy,
  getAllRemedies,
  getApprovedRemedies,
  getMyRemedies,
  updateRemedy,
  updateRemedyStatus,
  deleteRemedy,
} = require("../controllers/remedyController");

const { protect, authorize } = require("../middleware/authMiddleware");

/* ======================================================
   CREATE REMEDY
   Admin + Specialist
====================================================== */
router.post(
  "/",
  protect,
  authorize("admin", "specialist"),
  createRemedy
);

/* ======================================================
   GET ALL REMEDIES (ADMIN ONLY)
====================================================== */
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllRemedies
);

/* ======================================================
   GET MY REMEDIES (SPECIALIST ONLY)
====================================================== */
router.get(
  "/my",
  protect,
  authorize("specialist"),
  getMyRemedies
);

/* ======================================================
   GET APPROVED REMEDIES (PUBLIC)
====================================================== */
router.get(
  "/approved",
  getApprovedRemedies
);

/* ======================================================
   UPDATE REMEDY
   Admin → Any
   Specialist → Own Only
====================================================== */
router.put(
  "/:id",
  protect,
  authorize("admin", "specialist"),
  updateRemedy
);

/* ======================================================
   UPDATE STATUS (ADMIN ONLY)
====================================================== */
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  updateRemedyStatus
);

/* ======================================================
   DELETE REMEDY
   Admin → Any
   Specialist → Own Only
====================================================== */
router.delete(
  "/:id",
  protect,
  authorize("admin", "specialist"),
  deleteRemedy
);

module.exports = router;

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
  saveRemedy,
  unsaveRemedy,
  getSavedRemedies,
  searchRemediesBySymptom,
} = require("../controllers/remedyController");

const {
  protect,
  authorize,
  specialistApprovedOnly,
} = require("../middleware/authMiddleware");


/* ======================================================
   CREATE REMEDY - SPECIALIST (APPROVED ONLY)
====================================================== */
router.post(
  "/specialist",
  protect,
  specialistApprovedOnly,
  createRemedy
);


/* ======================================================
   CREATE REMEDY - ADMIN (AUTO APPROVED)
====================================================== */
router.post(
  "/admin",
  protect,
  authorize("admin"),
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
   GET MY REMEDIES (SPECIALIST)
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
   SEARCH REMEDIES BY SYMPTOM
====================================================== */
router.get(
  "/search",
  searchRemediesBySymptom
);


/* ======================================================
   SAVE REMEDY
====================================================== */
router.post(
  "/save/:id",
  protect,
  authorize("user"),
  saveRemedy
);


/* ======================================================
   UNSAVE REMEDY
====================================================== */
router.delete(
  "/save/:id",
  protect,
  authorize("user"),
  unsaveRemedy
);


/* ======================================================
   GET SAVED REMEDIES
====================================================== */
router.get(
  "/saved",
  protect,
  authorize("user"),
  getSavedRemedies
);


/* ======================================================
   UPDATE REMEDY
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
====================================================== */
router.delete(
  "/:id",
  protect,
  authorize("admin", "specialist"),
  deleteRemedy
);


module.exports = router;
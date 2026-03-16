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
  searchRemediesBySymptom
} = require("../controllers/remedyController");

const {
  protect,
  authorize,
  specialistApprovedOnly
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");


/* ======================================================
   CREATE REMEDY - SPECIALIST
====================================================== */

router.post(
  "/specialist",
  protect,
  specialistApprovedOnly,
  upload.single("image"),
  createRemedy
);


/* ======================================================
   CREATE REMEDY - ADMIN
====================================================== */

router.post(
  "/admin",
  protect,
  authorize("admin"),
  upload.single("image"),
  createRemedy
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
   GET SAVED REMEDIES
====================================================== */

router.get(
  "/saved",
  protect,
  authorize("user"),
  getSavedRemedies
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
   GET MY REMEDIES (SPECIALIST)
====================================================== */

router.get(
  "/my",
  protect,
  authorize("specialist"),
  getMyRemedies
);


/* ======================================================
   GET ALL REMEDIES (ADMIN)
====================================================== */

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllRemedies
);


/* ======================================================
   UPDATE REMEDY
====================================================== */

router.put(
  "/:id",
  protect,
  authorize("admin", "specialist"),
  upload.single("image"),
  updateRemedy
);


/* ======================================================
   UPDATE REMEDY STATUS (ADMIN)
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
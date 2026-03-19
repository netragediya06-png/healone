const express = require("express");
const router = express.Router();

const {
  createRemedy,
  getAllRemedies,
  getApprovedRemedies,
  getSingleRemedy,
  getMyRemedies,
  updateRemedy,
  updateRemedyStatus,
  deleteRemedy,
  saveRemedy,
  unsaveRemedy,
  getSavedRemedies,
  searchRemediesBySymptom,
  incrementDownload
} = require("../controllers/remedyController");

const {
  protect,
  authorize,
  specialistApprovedOnly
} = require("../middleware/authMiddleware");

const { uploadRemedyImage } = require("../middleware/upload");


/* ======================================================
   CREATE REMEDY - SPECIALIST
====================================================== */

router.post(
  "/specialist",
  protect,
  specialistApprovedOnly,
  uploadRemedyImage,
  createRemedy
);


/* ======================================================
   CREATE REMEDY - ADMIN
====================================================== */

router.post(
  "/admin",
  protect,
  authorize("admin"),
  uploadRemedyImage,
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
   DOWNLOAD COUNT (OPTIONAL) ✅
====================================================== */
router.post(
  "/download/:id",
  incrementDownload
);
/* ======================================================
   SAVE REMEDY
====================================================== */
router.post(
  "/save/:id",
  protect,
  authorize("user", "specialist", "admin"), // ✅ improved
  saveRemedy
);
/* ======================================================
   UNSAVE REMEDY
====================================================== */
router.delete(
  "/save/:id",
  protect,
  authorize("user", "specialist", "admin"), // ✅ improved
  unsaveRemedy
);
/* ======================================================
   GET SAVED REMEDIES
====================================================== */

router.get(
  "/saved",
  protect,
  authorize("user", "specialist", "admin"),
  getSavedRemedies
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
  uploadRemedyImage,
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
/* ======================================================
   GET SINGLE REMEDY (DETAIL PAGE)
====================================================== */
router.get("/:id", getSingleRemedy);

module.exports = router;
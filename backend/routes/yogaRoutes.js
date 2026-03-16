const express = require("express");
const router = express.Router();

const {
  createYoga,
  getAllYoga,
  getApprovedYoga,
  getMyYoga,
  updateYoga,
  updateYogaStatus,
  deleteYoga,
  saveYoga,
  unsaveYoga,
  getSavedYoga,
  searchYogaByTag
} = require("../controllers/yogaController");

const {
  protect,
  authorize,
  specialistApprovedOnly
} = require("../middleware/authMiddleware");

const upload = require("../middleware/upload");


/* ======================================================
   CREATE YOGA - SPECIALIST
====================================================== */

router.post(
  "/specialist",
  protect,
  specialistApprovedOnly,
  upload.single("image"),
  createYoga
);


/* ======================================================
   CREATE YOGA - ADMIN
====================================================== */

router.post(
  "/admin",
  protect,
  authorize("admin"),
  upload.single("image"),
  createYoga
);


/* ======================================================
   GET APPROVED YOGA (PUBLIC)
====================================================== */

router.get(
  "/approved",
  getApprovedYoga
);


/* ======================================================
   SEARCH YOGA BY TAG
====================================================== */

router.get(
  "/search",
  searchYogaByTag
);


/* ======================================================
   GET SAVED YOGA
====================================================== */

router.get(
  "/saved",
  protect,
  authorize("user"),
  getSavedYoga
);


/* ======================================================
   SAVE YOGA
====================================================== */

router.post(
  "/save/:id",
  protect,
  authorize("user"),
  saveYoga
);


/* ======================================================
   UNSAVE YOGA
====================================================== */

router.delete(
  "/save/:id",
  protect,
  authorize("user"),
  unsaveYoga
);


/* ======================================================
   GET MY YOGA (SPECIALIST)
====================================================== */

router.get(
  "/my",
  protect,
  authorize("specialist"),
  getMyYoga
);


/* ======================================================
   GET ALL YOGA (ADMIN)
====================================================== */

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllYoga
);


/* ======================================================
   UPDATE YOGA
====================================================== */

router.put(
  "/:id",
  protect,
  authorize("admin", "specialist"),
  upload.single("image"),
  updateYoga
);


/* ======================================================
   UPDATE YOGA STATUS (ADMIN)
====================================================== */

router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  updateYogaStatus
);


/* ======================================================
   DELETE YOGA
====================================================== */

router.delete(
  "/:id",
  protect,
  authorize("admin", "specialist"),
  deleteYoga
);

module.exports = router;
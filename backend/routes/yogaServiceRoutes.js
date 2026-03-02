const express = require("express");
const router = express.Router();

const {
  createYogaService,
  getAllYogaServices,
  getMyYogaServices,
  getApprovedYogaServices,
  updateYogaService,
  updateYogaStatus,
  deleteYogaService,
} = require("../controllers/yogaServiceController");

const { protect, authorize } = require("../middleware/authMiddleware");


/* ======================================================
   CREATE YOGA SERVICE
   Admin + Specialist
====================================================== */
router.post(
  "/",
  protect,
  authorize("admin", "specialist"),
  createYogaService
);


/* ======================================================
   GET ALL YOGA SERVICES (ADMIN ONLY)
====================================================== */
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllYogaServices
);


/* ======================================================
   GET MY YOGA SERVICES (SPECIALIST ONLY)
====================================================== */
router.get(
  "/my",
  protect,
  authorize("specialist"),
  getMyYogaServices
);


/* ======================================================
   GET APPROVED YOGA SERVICES (PUBLIC)
====================================================== */
router.get(
  "/approved",
  getApprovedYogaServices
);


/* ======================================================
   UPDATE YOGA SERVICE
   Admin → Any
   Specialist → Own Only
====================================================== */
router.put(
  "/:id",
  protect,
  authorize("admin", "specialist"),
  updateYogaService
);


/* ======================================================
   UPDATE STATUS (ADMIN ONLY)
====================================================== */
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  updateYogaStatus
);


/* ======================================================
   DELETE YOGA SERVICE
   Admin → Any
   Specialist → Own Only
====================================================== */
router.delete(
  "/:id",
  protect,
  authorize("admin", "specialist"),
  deleteYogaService
);

module.exports = router;
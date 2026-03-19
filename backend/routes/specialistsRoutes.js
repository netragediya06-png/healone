const express = require("express");
const router = express.Router();

const {
  becomeSpecialist,
  getSpecialists,
  getSingleSpecialist,
  updateSpecialistProfile,
  deleteSpecialist,
  approveSpecialist,
  rejectSpecialist,
  getFilteredSpecialists
} = require("../controllers/specialistController");

const { protect } = require("../middleware/authMiddleware");
const { uploadSpecialist } = require("../middleware/upload");

/* =========================
   SPECIALIST ROUTES
========================= */

// 👉 Become Specialist
router.post(
  "/become-specialist",
  protect,
  uploadSpecialist,
  becomeSpecialist
);

// 👉 Get all specialists (admin)
router.get("/", getSpecialists);

// 👉 Filter specialists (public)
router.get("/filter", getFilteredSpecialists);

// 👉 Get single specialist
router.get("/:id", getSingleSpecialist);

// 👉 Update profile (specialist)
router.put("/update", protect, updateSpecialistProfile);

// 👉 Delete (admin)
router.delete("/:id", protect, deleteSpecialist);

// 👉 Approve (admin)
router.put("/approve/:id", protect, approveSpecialist);

// 👉 Reject (admin)
router.put("/reject/:id", protect, rejectSpecialist);

module.exports = router;
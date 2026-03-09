const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createProgram,
  getAdminPrograms,
  getApprovedPrograms,
  getSingleProgram,
  updateProgram,
  deleteProgram,
  approveProgram,
  rejectProgram
} = require("../controllers/programController");

const { protect, authorize } = require("../middleware/authMiddleware");
router.post(
  "/",
  protect,
  authorize("specialist"),
  upload.single("image"),
  createProgram
);
router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAdminPrograms
);
router.get(
  "/",
  getApprovedPrograms
);
router.get(
  "/:id",
  getSingleProgram
);
router.put(
  "/:id",
  protect,
  authorize("specialist"),
  updateProgram
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProgram
);
router.put(
  "/approve/:id",
  protect,
  authorize("admin"),
  approveProgram
);
router.put(
  "/reject/:id",
  protect,
  authorize("admin"),
  rejectProgram
);
module.exports = router;
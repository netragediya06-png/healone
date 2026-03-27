const express = require("express");
const router = express.Router();

const {
  subscribeProgram,            // ✅ FIXED
  getUserSubscriptions,
  getAllSubscriptions,
  checkProgramAccess,
  getSpecialistSubscriptions
} = require("../controllers/subscriptionController");

const { protect, authorize } = require("../middleware/authMiddleware");

/* ===============================
   USER SUBSCRIBE PROGRAM
   POST /api/subscriptions
================================ */

router.post(
  "/",
  protect,
  authorize("user"),
  subscribeProgram
);


/* ===============================
   USER SUBSCRIPTIONS
   GET /api/subscriptions/my
================================ */

router.get(
  "/my",
  protect,
  authorize("user"),
  getUserSubscriptions
);


/* ===============================
   CHECK PROGRAM ACCESS
   GET /api/subscriptions/access/:programId
================================ */

router.get(
  "/access/:programId",
  protect,
  authorize("user"),
  checkProgramAccess
);


/* ===============================
   ADMIN ALL SUBSCRIPTIONS
   GET /api/subscriptions/admin/all
================================ */

router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllSubscriptions
);
/* ===============================
   SPECIALIST SUBSCRIPTIONS
================================ */

router.get(
  "/specialist/my",
  protect,
  authorize("specialist"),
  getSpecialistSubscriptions
);

module.exports = router;  
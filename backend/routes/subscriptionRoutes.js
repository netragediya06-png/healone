const express = require("express");
const router = express.Router();

const {
  enrollProgram,
  getUserSubscriptions,
  getAllSubscriptions,
  checkProgramAccess
} = require("../controllers/subscriptionController");

const { protect, authorize } = require("../middleware/authMiddleware");

/* ===============================
   USER ENROLL PROGRAM
================================ */

router.post(
  "/",
  protect,
  authorize("user"),
  enrollProgram
);


/* ===============================
   USER SUBSCRIPTIONS
================================ */

router.get(
  "/my",
  protect,
  authorize("user"),
  getUserSubscriptions
);


/* ===============================
   CHECK PROGRAM ACCESS
================================ */

router.get(
  "/access/:programId",
  protect,
  authorize("user"),
  checkProgramAccess
);


/* ===============================
   ADMIN ALL SUBSCRIPTIONS
================================ */

router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllSubscriptions
);

module.exports = router;
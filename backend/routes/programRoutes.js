const express = require("express");
const router = express.Router();

const {
  createProgram,
  getAllPrograms,
  getApprovedPrograms,
  getMyPrograms,
  getProgram,
  updateProgram,
  updateProgramStatus,
  deleteProgram,
  enrollProgram
} = require("../controllers/programController");

const {
  protect,
  adminOnly,
  specialistOnly
} = require("../middleware/authMiddleware");

const { uploadProgramImage } = require("../middleware/upload");


/* ======================================================
   CREATE PROGRAM (SPECIALIST)
   POST /api/program/create
====================================================== */

router.post(
  "/create",
  protect,
  specialistOnly,
  uploadProgramImage,
  createProgram
);


/* ======================================================
   GET ALL PROGRAMS (ADMIN)
   GET /api/program/admin/all
====================================================== */

router.get(
  "/admin/all",
  protect,
  adminOnly,
  getAllPrograms
);


/* ======================================================
   GET APPROVED PROGRAMS (PUBLIC / USER)
   GET /api/program/approved
====================================================== */

router.get(
  "/approved",
  getApprovedPrograms
);


/* ======================================================
   GET MY PROGRAMS (SPECIALIST)
   GET /api/program/my-programs
====================================================== */

router.get(
  "/my-programs",
  protect,
  specialistOnly,
  getMyPrograms
);


/* ======================================================
   UPDATE PROGRAM (SPECIALIST)
   PUT /api/program/update/:id
====================================================== */

router.put(
  "/update/:id",
  protect,
  specialistOnly,
  uploadProgramImage,
  updateProgram
);


/* ======================================================
   ADMIN UPDATE PROGRAM STATUS
   PUT /api/program/status/:id
====================================================== */

router.put(
  "/status/:id",
  protect,
  adminOnly,
  updateProgramStatus
);


/* ======================================================
   DELETE PROGRAM
   DELETE /api/program/delete/:id
====================================================== */

router.delete(
  "/delete/:id",
  protect,
  adminOnly,
  deleteProgram
);


/* ======================================================
   USER ENROLL PROGRAM
   POST /api/program/enroll/:id
====================================================== */

router.post(
  "/enroll/:id",
  protect,
  enrollProgram
);


/* ======================================================
   GET SINGLE PROGRAM
   MUST BE LAST ROUTE
====================================================== */

router.get(
  "/:id",
  getProgram
);


module.exports = router;
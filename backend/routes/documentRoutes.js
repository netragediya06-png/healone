const express = require("express");
const router = express.Router();

const {
  uploadDocuments,
  uploadProfilePhoto
} = require("../controllers/documentController");

const { protect } = require("../middleware/authMiddleware");

const {
  uploadDocuments: uploadMiddleware,
  uploadSingle
} = require("../middleware/uploadMiddleware");


/* ===================================
   UPLOAD DOCUMENTS
=================================== */

router.post(
  "/upload",
  protect,
  uploadMiddleware,
  uploadDocuments
);


/* ===================================
   UPLOAD PROFILE PHOTO
=================================== */

router.post(
  "/profile-photo",
  protect,
  uploadSingle,        // single file
  uploadProfilePhoto
);


module.exports = router;
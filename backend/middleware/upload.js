const multer = require("multer");

// ==============================
// STORAGE
// ==============================
const storage = multer.memoryStorage();

// ==============================
// FILE FILTER
// ==============================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "application/pdf" // ✅ allow documents
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP, PDF allowed"), false);
  }
};

// ==============================
// MULTER CONFIG
// ==============================
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // ✅ increased to 5MB
  fileFilter
});

// ==============================
// EXPORTS
// ==============================

// ✅ Profile Photo (single)
exports.uploadProfilePhoto = upload.single("profilePhoto");

// ✅ Category Image
exports.uploadCategoryImage = upload.single("image");

// 🛒 Product
exports.uploadProductImage = upload.single("image");

// 🌿 Remedy
exports.uploadRemedyImage = upload.single("image");

// 🧘 Wellness Program
exports.uploadProgramImage = upload.single("image");

// 🔥 SPECIALIST (MAIN FIX)
exports.uploadSpecialist = upload.fields([
  { name: "profilePhoto", maxCount: 1 },  // must match frontend
  { name: "documents", maxCount: 5 }      // must match controller
]);
const multer = require("multer");

// ==============================
// STORAGE
// ==============================
const storage = multer.memoryStorage();

// ==============================
// FILE FILTER (images only)
// ==============================
const fileFilter = (req, file, cb) => {

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, and WEBP images are allowed"), false);
  }

};

// ==============================
// MULTER CONFIG
// ==============================
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter
});

module.exports = upload;
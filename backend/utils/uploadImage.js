const cloudinary = require("../config/cloudinary");

/* ==================================
   CLOUDINARY UPLOAD HELPER
================================== */

const uploadImage = (fileBuffer, folder) => {

  return new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        quality: "auto",
        fetch_format: "auto"
      },
      (error, result) => {

        if (error) return reject(error);

        resolve(result.secure_url);

      }
    );

    stream.end(fileBuffer);

  });

};

module.exports = uploadImage;
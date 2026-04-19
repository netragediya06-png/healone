import API from "./api";

/* ================= USER DATA ================= */

// ✅ Saved Remedies
const getSavedRemedies = () =>
  API.get("/users/me/saved-remedies");

// ✅ Saved Yoga
const getSavedYoga = () =>
  API.get("/users/me/saved-yoga");

// ✅ Subscribed Programs
const getSubscribedPrograms = () =>
  API.get("/users/me/subscribed-programs");


/* ================= PROFILE ================= */

// ✅ Update Profile (text data)
const updateProfile = (data: any) => {
  return API.put("/users/me", data);
};


// 🔥 NEW: Upload Profile Image
const uploadProfileImage = (file: File) => {
  const formData = new FormData();

  // ⚠️ MUST MATCH BACKEND FIELD NAME
  formData.append("profilePhoto", file);

  return API.put("/users/me/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export default {
  getSavedRemedies,
  getSavedYoga,
  getSubscribedPrograms,
  updateProfile,
  uploadProfileImage, // ✅ ADD THIS
};
import axios from "axios";

const API_URL = "http://localhost:5000/api/remedies";

/* =====================================
   AUTH HEADER
===================================== */
const authHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});

/* =====================================
   SPECIALIST
===================================== */

// Get remedies created by specialist
const getMyRemedies = async (token: string) => {
  const res = await axios.get(
    `${API_URL}/my`,
    authHeader(token)
  );
  return res.data;
};

// Create remedy
const createRemedy = async (data: FormData, token: string) => {
  const res = await axios.post(
    `${API_URL}/specialist`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return res.data;
};

// Update remedy
const updateRemedy = async (id: string, data: FormData, token: string) => {
  const res = await axios.put(
    `${API_URL}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );
  return res.data;
};

// Delete remedy
const deleteRemedy = async (id: string, token: string) => {
  const res = await axios.delete(
    `${API_URL}/${id}`,
    authHeader(token)
  );
  return res.data;
};


/* =====================================
   ADMIN
===================================== */

// Get all remedies
const getAllRemedies = async (token: string) => {
  const res = await axios.get(
    `${API_URL}`,
    authHeader(token)
  );
  return res.data;
};

// Approve / Reject remedy
const updateRemedyStatus = async (
  id: string,
  status: string,
  token: string
) => {
  const res = await axios.put(
    `${API_URL}/${id}/status`,
    { status },
    authHeader(token)
  );
  return res.data;
};


/* =====================================
   PUBLIC / USER
===================================== */

// Get all approved remedies
const getApprovedRemedies = async () => {
  const res = await axios.get(`${API_URL}/approved`);
  return res.data;
};

// Get single remedy (DETAIL PAGE)
const getSingleRemedy = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// Search remedies
const searchRemedies = async (symptom: string) => {
  const res = await axios.get(
    `${API_URL}/search?symptom=${symptom}`
  );
  return res.data;
};

// Save remedy
const saveRemedy = async (id: string, token: string) => {
  const res = await axios.post(
    `${API_URL}/save/${id}`,
    {},
    authHeader(token)
  );
  return res.data;
};

// Unsave remedy
const unsaveRemedy = async (id: string, token: string) => {
  const res = await axios.delete(
    `${API_URL}/save/${id}`,
    authHeader(token)
  );
  return res.data;
};

// Get saved remedies
const getSavedRemedies = async (token: string) => {
  const res = await axios.get(
    `${API_URL}/saved`,
    authHeader(token)
  );
  return res.data;
};

// Increment download count
const incrementDownload = async (id: string) => {
  const res = await axios.post(
    `${API_URL}/download/${id}`
  );
  return res.data;
};
/* =====================================
   NEW: WISHLIST & SAVE (CORRECT API)
===================================== */

import API from "./api"; // 🔥 use your axios instance

// 🔖 SAVE REMEDY
export const toggleSaveRemedy = async (remedyId: string) => {
  const res = await API.post("/users/save/remedy", { remedyId });
  return res.data;
};

// ❤️ WISHLIST REMEDY
export const toggleWishlistRemedy = async (remedyId: string) => {
  const res = await API.post("/users/wishlist/remedy", { remedyId });
  return res.data;
};

// 📄 GET SAVED REMEDIES
export const getSavedRemediesNew = async () => {
  const res = await API.get("/users/saved-remedies");
  return res.data;
};

// 📄 GET WISHLIST REMEDIES
export const getWishlistRemedies = async () => {
  const res = await API.get("/users/wishlist-remedies");
  return res.data;
};

/* =====================================
   EXPORT
===================================== */

const remedyService = {
  // specialist
  getMyRemedies,
  createRemedy,
  updateRemedy,
  deleteRemedy,

  // admin
  getAllRemedies,
  updateRemedyStatus,

  // public/user
  getApprovedRemedies,
  getSingleRemedy,
  searchRemedies,
  saveRemedy,
  unsaveRemedy,
  getSavedRemedies,
  incrementDownload
};

export default remedyService;
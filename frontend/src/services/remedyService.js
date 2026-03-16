import axios from "axios";

const API_URL = "http://localhost:5000/api/remedies";

/* =====================================
   AUTH HEADER
===================================== */

const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
});


/* =====================================
   SPECIALIST
===================================== */

// Get remedies created by specialist
const getMyRemedies = async (token) => {

  const res = await axios.get(
    `${API_URL}/my`,
    authHeader(token)
  );

  return res.data;
};


// Create remedy (specialist)
const createRemedy = async (data, token) => {

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
const updateRemedy = async (id, data, token) => {

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
const deleteRemedy = async (id, token) => {

  const res = await axios.delete(
    `${API_URL}/${id}`,
    authHeader(token)
  );

  return res.data;
};



/* =====================================
   ADMIN
===================================== */

// Get all remedies (admin)
const getAllRemedies = async (token) => {

  const res = await axios.get(
    `${API_URL}`,
    authHeader(token)
  );

  return res.data;
};


// Update remedy status
const updateRemedyStatus = async (id, status, token) => {

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

// Get approved remedies
const getApprovedRemedies = async () => {

  const res = await axios.get(
    `${API_URL}/approved`
  );

  return res.data;
};


// Search remedies by symptom
const searchRemedies = async (symptom) => {

  const res = await axios.get(
    `${API_URL}/search?symptom=${symptom}`
  );

  return res.data;
};


// Save remedy
const saveRemedy = async (id, token) => {

  const res = await axios.post(
    `${API_URL}/save/${id}`,
    {},
    authHeader(token)
  );

  return res.data;
};


// Unsave remedy
const unsaveRemedy = async (id, token) => {

  const res = await axios.delete(
    `${API_URL}/save/${id}`,
    authHeader(token)
  );

  return res.data;
};


// Get saved remedies
const getSavedRemedies = async (token) => {

  const res = await axios.get(
    `${API_URL}/saved`,
    authHeader(token)
  );

  return res.data;
};



/* =====================================
   EXPORT
===================================== */

export default {

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
  searchRemedies,
  saveRemedy,
  unsaveRemedy,
  getSavedRemedies

};
import axios from "axios";

const API_URL = "http://localhost:5000/api/remedies";

// Helper to attach token
const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/* =====================================
   SPECIALIST
===================================== */

// Get remedies created by specialist
const getMyRemedies = async (token) => {
  const response = await axios.get(`${API_URL}/my`, authHeader(token));
  return response.data;
};

// Create remedy (specialist)
const createRemedy = async (data, token) => {
  const response = await axios.post(
    `${API_URL}/specialist`,
    data,
    authHeader(token)
  );
  return response.data;
};

// Update remedy
const updateRemedy = async (id, data, token) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    data,
    authHeader(token)
  );
  return response.data;
};

// Delete remedy
const deleteRemedy = async (id, token) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    authHeader(token)
  );
  return response.data;
};

/* =====================================
   USER FEATURES
===================================== */

// Get approved remedies
const getApprovedRemedies = async () => {
  const response = await axios.get(`${API_URL}/approved`);
  return response.data;
};

// Search remedies by symptom
const searchRemedies = async (symptom) => {
  const response = await axios.get(`${API_URL}/search?symptom=${symptom}`);
  return response.data;
};

// Save remedy
const saveRemedy = async (id, token) => {
  const response = await axios.post(
    `${API_URL}/save/${id}`,
    {},
    authHeader(token)
  );
  return response.data;
};

// Unsave remedy
const unsaveRemedy = async (id, token) => {
  const response = await axios.delete(
    `${API_URL}/save/${id}`,
    authHeader(token)
  );
  return response.data;
};

// Get saved remedies
const getSavedRemedies = async (token) => {
  const response = await axios.get(
    `${API_URL}/saved`,
    authHeader(token)
  );
  return response.data;
};

export default {
  // specialist
  getMyRemedies,
  createRemedy,
  updateRemedy,
  deleteRemedy,

  // user
  getApprovedRemedies,
  searchRemedies,
  saveRemedy,
  unsaveRemedy,
  getSavedRemedies,
};
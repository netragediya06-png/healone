import axios from "axios";

const API_URL = "http://localhost:5000/api/remedies";

// ==============================
// GET MY REMEDIES (Specialist)
// ==============================
const getMyRemedies = async (userId) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: { userid: userId },
  });
  return response.data;
};

// ==============================
// CREATE REMEDY
// ==============================
const createRemedy = async (data, userId) => {
  const response = await axios.post(API_URL, data, {
    headers: { userid: userId },
  });
  return response.data;
};

// ==============================
// UPDATE REMEDY
// ==============================
const updateRemedy = async (id, data, userId) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { userid: userId },
  });
  return response.data;
};

// ==============================
// DELETE REMEDY
// ==============================
const deleteRemedy = async (id, userId) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { userid: userId },
  });
  return response.data;
};

export default {
  getMyRemedies,
  createRemedy,
  updateRemedy,
  deleteRemedy,
};

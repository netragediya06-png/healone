import API from "./api"; // Axios instance

// Fetch saved data
const getSavedRemedies = (userId: string) => API.get(`/users/${userId}/saved-remedies`);
const getSavedYoga = (userId: string) => API.get(`/users/${userId}/saved-yoga`);
const getSubscribedPrograms = (userId: string) => API.get(`/users/${userId}/subscribed-programs`);

// Update profile
const updateProfile = (userId: string, data: any) => {
  return API.put(`/users/${userId}`, data); // JSON, no FormData
};

export default {
  getSavedRemedies,
  getSavedYoga,
  getSubscribedPrograms,
  updateProfile,
};
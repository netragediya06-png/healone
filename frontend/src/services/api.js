import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    console.log("✅ TOKEN SENT:", token);
  } else {
    console.warn("❌ NO TOKEN FOUND");
  }

  return req;
});

export default API;
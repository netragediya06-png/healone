import API from "./api";


// ===============================
// USER REGISTER
// ===============================
export const registerUser = async (data: FormData) => {
  const res = await API.post("/auth/register", data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};


// ===============================
// USER LOGIN
// ===============================
export const loginUser = async (data: any) => {
  const res = await API.post("/auth/login", data);

  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }

  return res.data;
};


// ===============================
// LOGOUT
// ===============================
export const logoutUser = () => {
  localStorage.removeItem("token");
};


// ===============================
// GET USER PROFILE
// ===============================
export const getProfile = async () => {
  const res = await API.get("/auth/profile");
  return res.data;
};
import API from "./api";


// ===============================
// USER REGISTER
// ===============================
export const registerUser = async (data: FormData) => {
  try {

    const res = await API.post("/auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return res.data;

  } catch (error: any) {
    throw error;
  }
};


// ===============================
// USER LOGIN
// ===============================
export const loginUser = async (data: any) => {
  try {

    const res = await API.post("/auth/login", data);

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("name", res.data.user.fullName);
    }

    return res.data;

  } catch (error: any) {
    throw error;
  }
};


// ===============================
// LOGOUT
// ===============================
export const logoutUser = () => {
  localStorage.clear(); // ✅ FIXED (important)
};


// ===============================
// GET USER PROFILE
// ===============================
export const getProfile = async () => {
  try {

    const res = await API.get("/auth/profile");

    return res.data;

  } catch (error: any) {
    throw error;
  }
};
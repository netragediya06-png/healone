import API from "./api";

/* ===============================
   USER REGISTER
=============================== */
export const registerUser = async (data: FormData) => {
  const res = await API.post("/auth/register", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/* ===============================
   USER LOGIN
=============================== */
export const loginUser = async (data: any) => {
  const res = await API.post("/auth/login", data);

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("userId", res.data.user.id);
    localStorage.setItem("email", res.data.user.email);
    localStorage.setItem("name", res.data.user.fullName);
    localStorage.setItem("profilePhoto", res.data.user.profilePhoto || "");
  }

  return res.data;
};

/* ===============================
   ADMIN LOGIN
=============================== */
export const adminLogin = async (data: any) => {
  const res = await API.post("/auth/admin-login", data);

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("userId", res.data.user.id);
    localStorage.setItem("name", res.data.user.fullName);
  }

  return res.data;
};

/* ===============================
   🔐 AUTH HEADER
=============================== */
const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

/* ===============================
   🔥 BECOME SPECIALIST
=============================== */
export const becomeSpecialist = async (data: FormData) => {
  const res = await API.post(
    "/specialists/become-specialist",
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // ❌ DO NOT add Content-Type here
      },
    }
  );

  return res.data;
};

/* ===============================
   PROFILE
=============================== */
export const getProfile = async () => {
  const res = await API.get("/auth/profile", authHeader());
  return res.data;
};

export const updateProfile = async (data: FormData) => {
  const res = await API.put("/auth/profile", data, {
    headers: {
      ...authHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

/* ===============================
   EMAIL VERIFY
=============================== */
export const verifyEmail = async (token: string) => {
  const res = await API.get(`/auth/verify-email/${token}`);
  return res.data;
};

/* ===============================
   PASSWORD
=============================== */
export const forgotPassword = async (email: string) => {
  const res = await API.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetPassword = async (token: string, password: string) => {
  const res = await API.post(`/auth/reset-password/${token}`, {
    password,
  });

  return res.data;
};

/* ===============================
   🚪 LOGOUT
=============================== */
export const logoutUser = () => {
  localStorage.clear();
};

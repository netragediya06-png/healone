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
   USER LOGIN (MULTI-ROLE FIXED)
=============================== */
export const loginUser = async (data: any) => {
  const res = await API.post("/auth/login", data);

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);

    // ✅ STORE ALL ROLES
    localStorage.setItem(
      "roles",
      JSON.stringify(res.data.user.roles)
    );

    const roles = res.data.user.roles;

    // ✅ HANDLE ACTIVE ROLE
    if (roles.length === 1) {
      localStorage.setItem("activeRole", roles[0]);
    } else {
      // multiple roles → let UI decide
      localStorage.removeItem("activeRole");
    }

    // ✅ OTHER USER DATA
    localStorage.setItem("userId", res.data.user.id);
    localStorage.setItem("email", res.data.user.email);
    localStorage.setItem("name", res.data.user.fullName);
    localStorage.setItem(
      "profilePhoto",
      res.data.user.profilePhoto || ""
    );
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

    // ✅ ADMIN ROLE
    localStorage.setItem(
      "roles",
      JSON.stringify(res.data.user.roles)
    );

    localStorage.setItem("activeRole", "admin");

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
   🧠 ROLE HELPERS
=============================== */
export const getRoles = () => {
  return JSON.parse(localStorage.getItem("roles") || "[]");
};

export const getActiveRole = () => {
  return localStorage.getItem("activeRole");
};

export const setActiveRole = (role: string) => {
  localStorage.setItem("activeRole", role);
};

/* ===============================
   🔁 SWITCH ROLE
=============================== */
export const switchRole = () => {
  const current = localStorage.getItem("activeRole");
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");

  if (roles.length < 2) return;

  const newRole = current === "specialist" ? "user" : "specialist";

  localStorage.setItem("activeRole", newRole);

  return newRole;
};

/* ===============================
   🚪 LOGOUT
=============================== */
export const logoutUser = () => {
  localStorage.clear();
};
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/services/authService";

const UserLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("❌ Please enter your email!");
      return;
    }

    if (!password.trim()) {
      setPasswordError("❌ Please enter your password!");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      if (remember) {
        localStorage.setItem("token", res.token);
      } else {
        sessionStorage.setItem("token", res.token);
      }

      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("role", res.user.role);
      localStorage.setItem("name", res.user.fullName);
      localStorage.setItem("profilePhoto", res.user.profilePhoto);

      if (res.user.role === "admin") navigate("/admin");
      else if (res.user.role === "specialist") navigate("/specialist");
      else navigate("/");

    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";

      if (msg.toLowerCase().includes("email")) {
        setEmailError("❌ " + msg);
      } else {
        setPasswordError("❌ " + msg);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1a5040b0] to-[#1a5040e8]">

      <div className="relative w-[850px] h-[550px] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* LOGIN FORM */}
        <div className="absolute right-0 w-1/2 h-full flex items-center justify-center p-10">
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            {/* EMAIL */}
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 bg-gray-100 rounded-lg outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 bg-gray-100 rounded-lg outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            {/* REMEMBER */}
            <div className="mb-3 text-sm">
              <input
                type="checkbox"
                onChange={(e) => setRemember(e.target.checked)}
              />{" "}
              Remember me
            </div>

            {/* FORGOT */}
            <div className="mb-3 text-sm">
              <a href="/forgot-password" className="text-green-600">
                Forgot Password?
              </a>
            </div>

            {/* BUTTON */}
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Login
            </button>
          </form>
        </div>

        {/* LEFT PANEL */}
        <div className="absolute left-0 w-1/2 h-full bg-[#1a5040] text-white flex flex-col justify-center items-center px-10">
          <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
          <p className="mb-4">Don't have an account?</p>
          <a href="/register">
            <button className="bg-white text-black px-5 py-2 rounded-lg">
              Register Now
            </button>
          </a>
        </div>

      </div>
    </div>
  );
};

export default UserLogin;
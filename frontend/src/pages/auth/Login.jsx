import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();
    setError("");

    try {

      console.log("🔹 Attempting login...");

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

      const data = res.data;

      console.log("✅ Login successful:", data);

      // Store JWT token
      localStorage.setItem("token", data.token);

      // Store user data
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("name", data.user.fullName);

      // Block unapproved specialists
      if (
        data.user.role === "specialist" &&
        data.user.verificationStatus !== "approved"
      ) {
        setError("Your specialist account is under review by admin 🌿");
        return;
      }

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin");
      }
      else if (data.user.role === "specialist") {
        navigate("/specialist");
      }
      else {
        navigate("/");
      }

    } catch (error) {

      console.error("❌ Login failed:", error);

      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );

    }

  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "40px",
          borderRadius: "18px",
          background: "#ffffff",
          boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
        }}
      >

        {/* Logo */}
        <div className="text-center mb-4">
          <div
            style={{
              width: "55px",
              height: "55px",
              margin: "0 auto",
              borderRadius: "50%",
              background: "#2e7d32",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            🌿
          </div>

          <h4 className="fw-semibold mt-3 mb-1">
            Welcome to HealOne
          </h4>

          <small className="text-muted">
            Ayurvedic Wellness Ecosystem
          </small>
        </div>

        {error && (
          <div className="alert alert-danger text-center py-1">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "10px",
              }}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "10px",
                padding: "10px",
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="btn w-100"
            style={{
              background: "#2e7d32",
              color: "white",
              borderRadius: "10px",
              padding: "10px",
              fontWeight: "500",
            }}
          >
            Login
          </button>

          <div className="text-center mt-3">
            <small className="text-muted">
              Don’t have an account?{" "}
              <Link to="/register">Register</Link>
            </small>
          </div>

        </form>

      </div>
    </div>
  );
}
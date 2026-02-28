import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    profession: "",
    experience: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // 1️⃣ Create Firebase Account
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // 2️⃣ Save User in MongoDB
      await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        profession: formData.role === "specialist" ? formData.profession : undefined,
        experience: formData.role === "specialist" ? formData.experience : undefined,
      });

      if (formData.role === "specialist") {
        setSuccess("Specialist registration submitted. Waiting for admin approval 🌿");
      } else {
        setSuccess("Registration successful 🎉 You can now login.");
      }

      setTimeout(() => navigate("/login"), 2000);

    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || error.message);
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
          width: "420px",
          padding: "40px",
          borderRadius: "18px",
          background: "#ffffff",
          boxShadow: "0 18px 40px rgba(0,0,0,0.15)",
        }}
      >
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
            }}
          >
            🌿
          </div>

          <h4 className="fw-semibold mt-3 mb-1">
            Create HealOne Account
          </h4>
          <small className="text-muted">
            Join our Ayurvedic wellness ecosystem
          </small>
        </div>

        {error && <div className="alert alert-danger py-1 text-center">{error}</div>}
        {success && <div className="alert alert-success py-1 text-center">{success}</div>}

        <form onSubmit={handleRegister}>

          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ borderRadius: "10px" }}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ borderRadius: "10px" }}
            />
          </div>

          {/* Role Selection */}
          <div className="mb-3">
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              style={{ borderRadius: "10px" }}
            >
              <option value="user">User</option>
              <option value="specialist">Specialist</option>
            </select>
          </div>

          {/* Show Extra Fields If Specialist */}
          {formData.role === "specialist" && (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  name="profession"
                  className="form-control"
                  placeholder="Profession (Ayurveda Doctor, Yoga Guru...)"
                  value={formData.profession}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "10px" }}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  name="experience"
                  className="form-control"
                  placeholder="Experience (Years)"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: "10px" }}
                />
              </div>
            </>
          )}

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
            Register
          </button>

          <div className="text-center mt-3">
            <small className="text-muted">
              Already have an account? <Link to="/login">Login</Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}

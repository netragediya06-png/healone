import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/services/authService";

export default function UserLogin() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    const res = await loginUser({
      email: form.email,
      password: form.password
    });

    // ✅ SAVE TOKEN
    if (form.remember) {
      localStorage.setItem("token", res.token);
    } else {
      sessionStorage.setItem("token", res.token);
    }

    // ✅ SAVE USER (IMPORTANT 🔥)
    localStorage.setItem("user", JSON.stringify(res.user));

    localStorage.setItem("role", res.user.role);

    // ✅ REDIRECT
    if (res.user.role === "admin") {
      navigate("/admin");
    } else if (res.user.role === "specialist") {
      navigate("/specialist");
    } else {
      navigate("/");
    }

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-6">

      <div className="max-w-md w-full bg-white shadow-xl rounded-3xl p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Welcome Back 🌿</h2>
          <p className="text-gray-500 text-sm">
            Login to your HealOne account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="input-premium w-full"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="input-premium w-full"
            required
          />

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                onChange={handleChange}
              />
              Remember me
            </label>

            <Link
              to="/forgot-password"
              className="text-green-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-green-600 font-medium">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
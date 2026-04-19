import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/admin-login",
        { email, password },
      );

      const data = res.data;

      // ✅ Store token
      localStorage.setItem("token", data.token);
      localStorage.setItem("roles", JSON.stringify(data.user.roles));
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("name", data.user.fullName);
      localStorage.setItem("activeRole", "admin");

      // ✅ Redirect
      if (data.user.roles.includes("admin")) {
        navigate("/admin");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl shadow-lg">
            🌿
          </div>

          <h2 className="text-3xl font-bold mt-4 text-gray-900">Admin Login</h2>

          <p className="text-gray-500 text-sm mt-1">Access HealOne Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg border border-gray-100 shadow-xl rounded-2xl p-8">
          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>

              <input
                type="email"
                placeholder="admin@healone.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <label className="font-medium text-gray-700">Password</label>

                <Link
                  to="/forgot-password"
                  className="text-emerald-600 hover:underline"
                >
                  Forgot?
                </Link>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          HealOne Admin Panel © 2026
        </p>
      </div>
    </div>
  );
}

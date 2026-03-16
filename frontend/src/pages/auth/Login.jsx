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

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const data = res.data;

      // Store token
      localStorage.setItem("token", data.token);

      // Store user info
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
      } else if (data.user.role === "specialist") {
        navigate("/specialist");
      } else {
        navigate("/");
      }

    } catch (error) {

      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">

          <div className="w-14 h-14 mx-auto rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl shadow">
            🌿
          </div>

          <h2 className="text-2xl font-semibold mt-4">
            HealOne Admin
          </h2>

          <p className="text-gray-500 text-sm">
            Sign in to your admin dashboard
          </p>

        </div>

        {/* Login Card */}
        <div className="bg-white border shadow-sm rounded-xl p-8">

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>

              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                placeholder="admin@healone.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

            </div>

            {/* Password */}
            <div>

              <div className="flex justify-between text-sm">

                <label className="font-medium text-gray-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-emerald-600 hover:underline"
                >
                  Forgot password?
                </Link>

              </div>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />

            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-medium transition"
            >
              Sign In
            </button>

          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          HealOne Admin Panel
        </p>

      </div>

    </div>
  );
}
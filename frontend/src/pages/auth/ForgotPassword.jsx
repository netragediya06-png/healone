import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(res.data.message);

    } catch (err) {

      setError(
        err.response?.data?.message || "Something went wrong"
      );

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow border">

        <h2 className="text-xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        <p className="text-gray-500 text-sm text-center mb-6">
          Enter your email to receive a password reset link
        </p>

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700"
          >
            Send Reset Link
          </button>

        </form>

      </div>

    </div>
  );
}
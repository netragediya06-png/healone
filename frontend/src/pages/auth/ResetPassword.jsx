import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [password,setPassword] = useState("");
  const [message,setMessage] = useState("");
  const [error,setError] = useState("");

  const handleSubmit = async (e)=>{

    e.preventDefault();

    try{

      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      setMessage(res.data.message);

      setTimeout(()=>{
        navigate("/login");
      },2000);

    }catch(err){

      setError(
        err.response?.data?.message || "Reset failed"
      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md border">

        <h2 className="text-xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-center text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg hover:bg-emerald-700"
          >
            Reset Password
          </button>

        </form>

      </div>

    </div>
  );
}
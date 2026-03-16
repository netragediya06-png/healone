import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import API from "@/services/api";

export default function VerifyEmail() {

  const { token } = useParams();
  const [status, setStatus] = useState("verifying");

  const called = useRef(false); // prevent double request

  useEffect(() => {

    if (!token || called.current) return;

    called.current = true;

    const verify = async () => {

      try {

        const res = await API.get(`/auth/verify-email/${token}`);

        console.log("VERIFY SUCCESS:", res.data);

        setStatus("success");

      } catch (error:any) {

        console.log("VERIFY ERROR:", error.response?.data);

        setStatus("error");

      }

    };

    verify();

  }, [token]);


  return (

    <div className="min-h-screen flex items-center justify-center bg-nature px-6">

      <div className="bg-white shadow-elevated rounded-3xl p-10 max-w-md text-center">

        {status === "verifying" && (
          <>
            <h2 className="text-2xl font-semibold mb-3">
              Verifying your email...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we confirm your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-semibold text-green-600 mb-3">
              Email Verified ✔
            </h2>

            <p className="text-muted-foreground mb-6">
              Your HealOne account is now active.
            </p>

            <Link to="/login" className="btn-premium">
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-semibold text-red-500 mb-3">
              Verification Failed
            </h2>

            <p className="text-muted-foreground mb-6">
              The verification link is invalid or expired.
            </p>

            <Link to="/register" className="btn-premium">
              Register Again
            </Link>
          </>
        )}

      </div>

    </div>

  );

}
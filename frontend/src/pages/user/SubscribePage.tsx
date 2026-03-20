import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { subscribeProgram } from "@/services/subscriptionService";
import gpay from "../../../../uploads/payments/GPay.png";
import upi from "../../../../uploads/payments/UPI.webp";
import phonepe from "../../../../uploads/payments/PhonePe-Logo.wine.png";
import razorpay from "../../../../uploads/payments/razorpay-icon.webp";

// const paymentOptions = [
//   { name: "Razorpay", image: razorpay },
//   { name: "UPI", image: upi },
//   { name: "GPay", image: gpay },
//   { name: "PhonePe", image: phonepe },
// ];
const SubscribePage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const program = state?.program;

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);


  const [showSuccess, setShowSuccess] = useState(false);
const [showError, setShowError] = useState(false);
const [errorMsg, setErrorMsg] = useState("");
  // ✅ AUTO SELECT PLAN (IMPORTANT FIX)
  useEffect(() => {
    if (state?.plan) {
      setSelectedPlan(state.plan);
    }
  }, [state]);

  if (!program) {
    return <p className="text-center mt-10">No program selected</p>;
  }

  // ================= SUCCESS =================
  const handleSuccess = async () => {
  if (!selectedPlan || !paymentMethod) {
    toast.error("Select plan & payment method");
    return;
  }

  try {
    setLoading(true);

    await subscribeProgram({
      programId: program._id,
      plan: selectedPlan.name,
      paymentMethod: paymentMethod,
    });

    // 🔥 SHOW SUCCESS MODAL
    setShowSuccess(true);

    setTimeout(() => {
      navigate("/my-subscriptions");
    }, 2500);

  } catch (err: any) {
    console.error(err);

    // 🔥 SHOW ERROR MODAL
    setErrorMsg(err?.response?.data?.message || "Payment Failed");
    setShowError(true);

  } finally {
    setLoading(false);
  }
};

  // ================= CONTINUE =================
  const handleContinue = () => {
  if (!selectedPlan) {
    toast.error("Please select a plan");
    return;
  }

  if (!paymentMethod || paymentMethod.trim() === "") {
    toast.error("Please select payment method");
    return;
  }

  handleSuccess();
};

 return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-12 px-4">

    {/* TITLE */}
    <h1 className="text-4xl font-bold text-center mb-2">
      Choose Your Plan
    </h1>

    <p className="text-center text-gray-500 mb-12">
      Select a plan & complete payment securely
    </p>

    {/* ================= PLANS ================= */}
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

      {program.plans.map((plan: any) => (
        <div
          key={plan.name}
          onClick={() => setSelectedPlan(plan)}
          className={`relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300
          ${
            selectedPlan?.name === plan.name
              ? "border-2 border-green-600 scale-105 shadow-xl"
              : "hover:scale-105 hover:shadow-xl"
          }`}
        >

          {/* TOP TAG */}
          {selectedPlan?.name === plan.name && (
            <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
              Selected
            </span>
          )}

          <h3 className="text-xl font-bold uppercase text-center">
            {plan.name}
          </h3>

          <p className="text-4xl font-bold text-center mt-4 text-green-600">
            ₹{plan.price}
          </p>

          <p className="text-center text-gray-400 text-sm mb-6">
            One-time payment
          </p>

          {/* FEATURES */}
          <ul className="text-sm text-gray-600 space-y-2 mb-6">
            <li>✔ Full Program Access</li>
            <li>✔ Expert Guidance</li>
            <li>✔ Herbal Kit Included</li>
            <li>✔ Support Available</li>
          </ul>

          <Button className="w-full">
            {selectedPlan?.name === plan.name
              ? "Selected"
              : "Select Plan"}
          </Button>

        </div>
      ))}
    </div>

    {/* ================= PAYMENT METHODS ================= */}
    <div className="mt-16 max-w-4xl mx-auto">

      <h3 className="text-xl font-semibold text-center mb-6">
        Select Payment Method
      </h3>

     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

  {[
    { name: "Razorpay", img: razorpay },
    { name: "UPI", img: upi },
    { name: "GPay", img: gpay },
    { name: "PhonePe", img: phonepe },
  ].map((method) => (
    <div
      key={method.name}
      onClick={() => setPaymentMethod(method.name)}
      className={`flex flex-col items-center justify-center gap-4 p-6 rounded-2xl border cursor-pointer transition-all
      ${
        paymentMethod === method.name
          ? "border-green-600 bg-green-50 scale-105 shadow-lg"
          : "hover:shadow-md"
      }`}
    >

      {/* IMAGE FIX */}
      <div className="h-16 flex items-center justify-center">
        <img
          src={method.img}
          alt={method.name}
          className="max-h-14 w-auto object-contain"
        />
      </div>

      {/* NAME */}
      <span className="font-semibold text-sm">
        {method.name}
      </span>

    </div>
  ))}

</div>
    </div>

    {/* ================= BUTTON ================= */}
    <div className="text-center mt-14">
      <Button
        size="lg"
        className="px-10 py-6 text-lg rounded-xl"
        onClick={handleContinue}
        disabled={loading}
      >
        {loading ? "Processing..." : "Continue Payment"}
      </Button>
    </div>
{/* ================= SUCCESS MODAL ================= */}
{showSuccess && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-8 w-[320px] text-center shadow-xl animate-scaleIn">

      {/* ICON */}
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 p-4 rounded-full">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* TEXT */}
      <h2 className="text-xl font-bold mb-2">
        Payment Successful 🎉
      </h2>

      <p className="text-gray-500 text-sm">
        Your subscription has been activated successfully.
      </p>

    </div>
  </div>
)}

{/* ================= ERROR MODAL ================= */}
{showError && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl p-8 w-[320px] text-center shadow-xl">

      {/* ICON */}
      <div className="flex justify-center mb-4">
        <div className="bg-red-100 p-4 rounded-full">
          <svg
            className="w-10 h-10 text-red-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>

      {/* TEXT */}
      <h2 className="text-xl font-bold mb-2">
        Payment Failed ❌
      </h2>

      <p className="text-gray-500 text-sm mb-4">
        {errorMsg}
      </p>

      <Button onClick={() => setShowError(false)}>
        Try Again
      </Button>

    </div>
  </div>
)}
  </div>
  
);
};

export default SubscribePage;
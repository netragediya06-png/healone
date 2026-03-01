import React, { useState } from "react";
import axios from "axios";
import "../auth/Register.css";

import StepRole from "../../components/RegisterSteps/StepRole";
import StepBasic from "../../components/RegisterSteps/StepBasic";
import StepProfessional from "../../components/RegisterSteps/StepProfessional";
import StepLocation from "../../components/RegisterSteps/StepLocation";
import StepDocuments from "../../components/RegisterSteps/StepDocuments";
import StepProfile from "../../components/RegisterSteps/StepProfile";
import StepReview from "../../components/RegisterSteps/StepReview";

const Register = () => {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    profilePhoto: "",

    professionalDetails: {
      specialization: "",
      experience: "",
      qualification: "",
      practiceName: "",
      consultationMode: "",
    },

    location: {
      state: "",
      city: "",
      address: "",
      pincode: "",
    },

    documents: {
      idProof: "",
      certificationProof: "",
    },

    bio: "",
    expertiseSummary: "",
    treatmentApproach: "",
    consultationFees: "",
    availableTimeSlots: "",
    languagesSpoken: "",
  });

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;

    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...formData, role };

      if (role === "user") {
        delete payload.professionalDetails;
        delete payload.documents;
        delete payload.bio;
        delete payload.expertiseSummary;
        delete payload.treatmentApproach;
        delete payload.consultationFees;
        delete payload.availableTimeSlots;
        delete payload.languagesSpoken;
      }

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        payload
      );

      alert(res.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const specialistSteps = [
    StepRole,
    StepBasic,
    StepProfessional,
    StepLocation,
    StepDocuments,
    StepProfile,
    StepReview,
  ];

  const userSteps = [
    StepRole,
    StepBasic,
    StepReview,
  ];

  const steps = role === "specialist" ? specialistSteps : userSteps;
  const CurrentStep = steps[step];

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

return (
  <div className="register-wrapper">
{/* LEFT PANEL */}
<div className="register-left">
<div className="brand-content">

  <div className="brand-logo">
    <div className="logo-placeholder">🌿</div>
    <h1 className="brand-title">HealOne</h1>
  </div>

  <h2 className="brand-headline">
    Where Nature Meets Wellness
  </h2>

  <p className="brand-description">
    Discover holistic products and trusted specialists.
  </p>

  <div className="brand-tags">
    Ayurveda • Yoga • Therapy • Natural Remedies
  </div>

</div>
</div>

    {/* RIGHT PANEL */}
    <div className="register-right">
      <div className="form-container">

        <div className="step-indicator">
          <div
            className="step-progress-line"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
            }}
          ></div>
        </div>

        <div className="step-counter">
          Step {step + 1} of {steps.length}
        </div>

        <CurrentStep
          role={role}
          setRole={setRole}
          formData={formData}
          handleChange={handleChange}
          nextStep={nextStep}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
        />

      </div>
    </div>

  </div>
);
};

export default Register;
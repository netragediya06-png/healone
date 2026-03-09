import React, { useState } from "react";
import axios from "axios";
import "../auth/Register.css";

import Stepper from "../../components/RegisterSteps/Stepper";

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
    confirmPassword: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    profilePhoto: "",

    professionalDetails: {
      specialization: "",
      experience: "",
      qualification: "",
      practiceName: "",
      consultationMode: "",
    },

    location: {
      country: "",
      state: "",
      city: "",
      area: "",
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

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */

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

  /* =========================
     REGISTER SUBMIT
  ========================= */

/* =========================
   REGISTER SUBMIT
========================= */

const handleSubmit = async () => {

  try {

    const form = new FormData();

    form.append("fullName", formData.fullName);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("phone", formData.phone);
    form.append("gender", formData.gender);
    form.append("dateOfBirth", formData.dateOfBirth);
    form.append("role", role);

    if (formData.profilePhoto) {
      form.append("profilePhoto", formData.profilePhoto);
    }

    /* Specialist fields */

    if (role === "specialist") {

      form.append(
        "professionalDetails",
        JSON.stringify(formData.professionalDetails)
      );

      form.append(
        "location",
        JSON.stringify(formData.location)
      );

      form.append(
        "documents",
        JSON.stringify(formData.documents)
      );

      form.append("bio", formData.bio);
      form.append("expertiseSummary", formData.expertiseSummary);
      form.append("treatmentApproach", formData.treatmentApproach);
      form.append("consultationFees", formData.consultationFees);
      form.append("availableTimeSlots", formData.availableTimeSlots);
      form.append("languagesSpoken", formData.languagesSpoken);

    }

    const res = await axios.post(
      "http://localhost:5000/api/auth/register",
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    alert(res.data.message);

  } catch (error) {

    alert(error.response?.data?.message || "Registration failed");

  }

};

  /* =========================
     STEP FLOWS
  ========================= */

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
    StepLocation,
    StepReview,
  ];

  const steps = role === "specialist" ? specialistSteps : userSteps;
  const CurrentStep = steps[step];

  /* =========================
     STEPPER LABELS
  ========================= */

  const stepLabels =
    role === "specialist"
      ? [
          "Role",
          "Basic Info",
          "Professional",
          "Location",
          "Documents",
          "Profile",
          "Review",
        ]
      : [
          "Role",
          "Basic Info",
          "Location",
          "Review",
        ];

  /* =========================
     NAVIGATION
  ========================= */

  const nextStep = () => {
    if (step < steps.length - 1)
      setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (step > 0)
      setStep((prev) => prev - 1);
  };

  /* =========================
     UI
  ========================= */

  return (

    <div className="register-page">

      {/* STEPPER */}
      <Stepper
        steps={stepLabels}
        currentStep={step}
      />

      {/* FORM CARD */}
      <div className="register-card">

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

      {/* LOGIN */}
      <div className="login-link">
        Already have an account? <a href="/login">Login</a>
      </div>

    </div>

  );
};

export default Register;
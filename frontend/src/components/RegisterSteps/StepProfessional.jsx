import React from "react";
import {
  FaStethoscope,
  FaBriefcase,
  FaGraduationCap,
  FaClinicMedical,
  FaLaptopMedical,
} from "react-icons/fa";

const StepProfessional = ({ formData, handleChange, nextStep, prevStep }) => {
  const { professionalDetails } = formData;
  const {
    specialization,
    experience,
    qualification,
    practiceName,
    consultationMode,
  } = professionalDetails;

  const handleNext = () => {
    if (
      !specialization ||
      !experience ||
      !qualification ||
      !practiceName ||
      !consultationMode
    ) {
      alert("Please fill all professional details.");
      return;
    }
    nextStep();
  };

  return (
    <div className="step-content">

      <h2 className="form-title">Professional Details</h2>
      <p className="form-subtitle">
        Share your wellness expertise
      </p>

      <div className="form-grid">

        {/* SPECIALIZATION */}
        <div className="input-group-advanced">
          <FaStethoscope className="input-icon" />
          <input
            type="text"
            name="specialization"
            placeholder="Specialization (Ayurveda, Yoga, Herbal, etc.)"
            value={specialization}
            onChange={(e) => handleChange(e, "professionalDetails")}
          />
        </div>

        {/* EXPERIENCE */}
        <div className="input-group-advanced">
          <FaBriefcase className="input-icon" />
          <input
            type="number"
            name="experience"
            placeholder="Experience (Years)"
            value={experience}
            onChange={(e) => handleChange(e, "professionalDetails")}
          />
        </div>

        {/* QUALIFICATION */}
        <div className="input-group-advanced full-width">
          <FaGraduationCap className="input-icon" />
          <input
            type="text"
            name="qualification"
            placeholder="Qualification / Certification"
            value={qualification}
            onChange={(e) => handleChange(e, "professionalDetails")}
          />
        </div>

        {/* PRACTICE NAME */}
        <div className="input-group-advanced full-width">
          <FaClinicMedical className="input-icon" />
          <input
            type="text"
            name="practiceName"
            placeholder="Practice / Clinic / Brand Name"
            value={practiceName}
            onChange={(e) => handleChange(e, "professionalDetails")}
          />
        </div>

        {/* CONSULTATION MODE */}
        <div className="input-group-advanced full-width">
          <FaLaptopMedical className="input-icon" />
          <select
            name="consultationMode"
            value={consultationMode}
            onChange={(e) => handleChange(e, "professionalDetails")}
          >
            <option value="">Select Consultation Mode</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="both">Both</option>
          </select>
        </div>

      </div>

      <div className="nav-buttons">
        <button className="secondary-btn" onClick={prevStep}>
          ← Back
        </button>

        <button className="primary-btn" onClick={handleNext}>
          Next →
        </button>
      </div>

    </div>
  );
};

export default StepProfessional;
import React from "react";
import {
  FaUserCircle,
  FaBrain,
  FaLeaf,
  FaRupeeSign,
  FaClock,
  FaLanguage,
} from "react-icons/fa";

const StepProfile = ({ formData, handleChange, nextStep, prevStep }) => {
  const {
    bio,
    expertiseSummary,
    treatmentApproach,
    consultationFees,
    availableTimeSlots,
    languagesSpoken,
  } = formData;

  const handleNext = () => {
    if (!bio || !expertiseSummary) {
      alert("Please fill required profile details.");
      return;
    }
    nextStep();
  };

  return (
    <div className="step-content">

      <h2 className="form-title">Wellness Profile</h2>
      <p className="form-subtitle">
        Let users understand your healing philosophy
      </p>

      <div className="profile-section">

        {/* BIO */}
        <div className="textarea-group">
          <FaUserCircle className="textarea-icon" />
          <textarea
            name="bio"
            placeholder="Short Bio (Required)"
            value={bio}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {/* EXPERTISE */}
        <div className="textarea-group">
          <FaBrain className="textarea-icon" />
          <textarea
            name="expertiseSummary"
            placeholder="Expertise Summary (Required)"
            value={expertiseSummary}
            onChange={handleChange}
            rows="3"
          />
        </div>

        {/* TREATMENT APPROACH */}
        <div className="textarea-group">
          <FaLeaf className="textarea-icon" />
          <textarea
            name="treatmentApproach"
            placeholder="Treatment Approach (Optional)"
            value={treatmentApproach}
            onChange={handleChange}
            rows="3"
          />
        </div>

      </div>

      {/* ADDITIONAL DETAILS */}
      <div className="form-grid">

        <div className="input-group-advanced">
          <FaRupeeSign className="input-icon" />
          <input
            type="number"
            name="consultationFees"
            placeholder="Consultation Fees (Optional)"
            value={consultationFees}
            onChange={handleChange}
          />
        </div>

        <div className="input-group-advanced">
          <FaClock className="input-icon" />
          <input
            type="text"
            name="availableTimeSlots"
            placeholder="Available Time Slots (Optional)"
            value={availableTimeSlots}
            onChange={handleChange}
          />
        </div>

        <div className="input-group-advanced full-width">
          <FaLanguage className="input-icon" />
          <input
            type="text"
            name="languagesSpoken"
            placeholder="Languages Spoken (Comma separated)"
            value={languagesSpoken}
            onChange={handleChange}
          />
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

export default StepProfile;
import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";

const StepReview = ({ formData, role, prevStep, handleSubmit }) => {
  const {
    fullName,
    email,
    phone,
    professionalDetails,
    location,
    bio,
    expertiseSummary,
    consultationFees,
  } = formData;

  return (
    <div className="step-content">

      <h2>Review & Confirm</h2>
      <p className="step-subtitle">
        Please verify your details before submitting
      </p>

      <div className="review-grid">

        {/* ACCOUNT TYPE */}
        <div className="review-card highlight-card">
          <div className="review-icon-box highlight-icon">
            <FaCheckCircle />
          </div>
          <div className="review-content">
            <h4>Account Type</h4>
            <p>
              {role === "specialist"
                ? "Wellness Specialist"
                : "Wellness User"}
            </p>
          </div>
        </div>

        {/* BASIC INFO */}
        <div className="review-card">
          <div className="review-icon-box">
            <FaUser />
          </div>
          <div className="review-content">
            <h4>Basic Information</h4>
            <div className="review-lines">
              <span><strong>Name:</strong> {fullName}</span>
              <span><FaEnvelope /> {email}</span>
              <span><FaPhone /> {phone}</span>
            </div>
          </div>
        </div>

        {role === "specialist" && (
          <>
            {/* PROFESSIONAL */}
            <div className="review-card">
              <div className="review-icon-box">
                <FaBriefcase />
              </div>
              <div className="review-content">
                <h4>Professional Details</h4>
                <div className="review-lines">
                  <span><strong>Specialization:</strong> {professionalDetails.specialization}</span>
                  <span><strong>Experience:</strong> {professionalDetails.experience} years</span>
                  <span><strong>Qualification:</strong> {professionalDetails.qualification}</span>
                  <span><strong>Practice:</strong> {professionalDetails.practiceName}</span>
                </div>
              </div>
            </div>

            {/* LOCATION */}
            <div className="review-card">
              <div className="review-icon-box">
                <FaMapMarkerAlt />
              </div>
              <div className="review-content">
                <h4>Location</h4>
                <div className="review-lines">
                  <span>
                    {location.address}, {location.city}, {location.state}
                  </span>
                </div>
              </div>
            </div>

            {/* PROFILE */}
            <div className="review-card">
              <div className="review-icon-box">
                <FaFileAlt />
              </div>
              <div className="review-content">
                <h4>Profile Summary</h4>
                <div className="review-lines">
                  <span><strong>Bio:</strong> {bio}</span>
                  <span><strong>Expertise:</strong> {expertiseSummary}</span>
                  {consultationFees && (
                    <span><strong>Fees:</strong> ₹{consultationFees}</span>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

      </div>

      <div className="nav-buttons">
        <button className="secondary-btn" onClick={prevStep}>
          ← Back
        </button>

        <button className="primary-btn" onClick={handleSubmit}>
          Submit Registration
        </button>
      </div>

    </div>
  );
};

export default StepReview;
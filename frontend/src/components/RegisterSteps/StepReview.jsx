import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCheckCircle
} from "react-icons/fa";

const StepReview = ({ formData, role, prevStep, handleSubmit }) => {

  const {
    fullName,
    email,
    phone,
    profilePhoto,
    professionalDetails,
    location,
    bio,
    expertiseSummary,
    consultationFees
  } = formData;

  return (
    <div className="step-content">

      <h2 className="form-title">Review & Confirm</h2>
      <p className="form-subtitle">
        Please verify your details before submitting
      </p>

      {/* PROFILE PREVIEW */}
      <div className="review-profile">

        {profilePhoto ? (
          <img src={profilePhoto} alt="profile" />
        ) : (
          <div className="review-avatar">
            <FaUser />
          </div>
        )}

        <div className="review-profile-info">
          <h4>{fullName}</h4>
          <p>{email}</p>
        </div>

      </div>

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
              <span><FaEnvelope /> {email}</span>
              <span><FaPhone /> {phone}</span>
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

              {role === "user" ? (
                <span>
                  {location.area}, {location.city}, {location.state} - {location.pincode}
                </span>
              ) : (
                <span>
                  {location.address}, {location.city}, {location.state} - {location.pincode}
                </span>
              )}

            </div>

          </div>

        </div>

        {/* SPECIALIST ONLY */}
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
                  <span>{professionalDetails.specialization}</span>
                  <span>{professionalDetails.experience} years experience</span>
                  <span>{professionalDetails.qualification}</span>
                  <span>{professionalDetails.practiceName}</span>
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
                  <span>{bio}</span>
                  <span>{expertiseSummary}</span>

                  {consultationFees && (
                    <span>Consultation Fee: ₹{consultationFees}</span>
                  )}

                </div>

              </div>

            </div>

          </>
        )}

      </div>

      {/* BUTTONS */}
      <div className="nav-buttons">

        <button
          className="secondary-btn"
          onClick={prevStep}
        >
          ← Back
        </button>

        <button
          className="primary-btn"
          onClick={handleSubmit}
        >
          Submit Registration
        </button>

      </div>

    </div>
  );
};

export default StepReview;
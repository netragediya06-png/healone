import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaCalendarAlt,
  FaVenusMars,
  FaCamera
} from "react-icons/fa";

const StepBasic = ({ formData, handleChange, nextStep, prevStep }) => {

  const {
    fullName,
    email,
    password,
    confirmPassword,
    phone,
    gender,
    dateOfBirth,
    profilePhoto
  } = formData;

  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(
    profilePhoto ? URL.createObjectURL(profilePhoto) : ""
  );

  /* =========================
     IMAGE SELECT + PREVIEW
  ========================= */

  const handleImageChange = (file) => {

    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    handleChange({
      target: {
        name: "profilePhoto",
        value: file
      }
    });
  };

  /* =========================
     NEXT STEP VALIDATION
  ========================= */

  const handleNext = () => {

    if (
      !fullName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !gender ||
      !dateOfBirth
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    nextStep();
  };

  return (
    <div className="step-content">

      <h2 className="form-title">Basic Information</h2>
      <p className="form-subtitle">
        Tell us about yourself
      </p>

      {/* =========================
         PROFILE PHOTO
      ========================= */}

      <div className="avatar-wrapper">

        <label className="avatar-box">

          {preview ? (
            <img
              src={preview}
              alt="profile preview"
              className="avatar-img"
            />
          ) : (
            <div className="avatar-placeholder">
              <FaUser />
            </div>
          )}

          <div className="avatar-edit">
            <FaCamera />
          </div>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) =>
              handleImageChange(e.target.files[0])
            }
          />

        </label>

      </div>

      {/* =========================
         FORM GRID
      ========================= */}

      <div className="form-grid">

        {/* FULL NAME */}
        <div className="input-group-advanced">
          <FaUser className="input-icon" />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={fullName}
            onChange={handleChange}
          />
        </div>

        {/* EMAIL */}
        <div className="input-group-advanced">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="input-group-advanced">
          <FaLock className="input-icon" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
          />

          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>

        </div>

        {/* CONFIRM PASSWORD */}
        <div className="input-group-advanced">
          <FaLock className="input-icon" />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword || ""}
            onChange={handleChange}
          />
        </div>

        {/* PHONE */}
        <div className="input-group-advanced">
          <FaPhone className="input-icon" />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={handleChange}
          />
        </div>

        {/* GENDER */}
        <div className="input-group-advanced">
          <FaVenusMars className="input-icon" />

          <select
            name="gender"
            value={gender || ""}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

        </div>

        {/* DATE OF BIRTH */}
        <div className="input-group-advanced full-width">
          <FaCalendarAlt className="input-icon" />
          <input
            type="date"
            name="dateOfBirth"
            value={dateOfBirth || ""}
            onChange={handleChange}
          />
        </div>

      </div>

      {/* =========================
         BUTTONS
      ========================= */}

      <div className="nav-buttons">

        <button
          className="secondary-btn"
          onClick={prevStep}
        >
          ← Back
        </button>

        <button
          className="primary-btn"
          onClick={handleNext}
        >
          Next →
        </button>

      </div>

    </div>
  );
};

export default StepBasic; 
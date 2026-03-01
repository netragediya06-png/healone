import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";

const StepBasic = ({ formData, handleChange, nextStep, prevStep }) => {
  const { fullName, email, password, phone } = formData;
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => {
    if (!fullName || !email || !password || !phone) {
      alert("Please fill all required fields.");
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

export default StepBasic;
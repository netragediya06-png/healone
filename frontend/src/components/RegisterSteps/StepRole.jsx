import React from "react";
import { FaUser, FaUserMd } from "react-icons/fa";

const StepRole = ({ role, setRole, nextStep }) => {
  return (
    <div className="step-content">

      <h2 className="form-title">Join HealOne</h2>
      <p className="form-subtitle">
        Select your role to continue
      </p>

      <div className="role-grid">

        {/* USER */}
        <div
          className={`role-card ${role === "user" ? "active" : ""}`}
          onClick={() => setRole("user")}
        >
          <div className="role-icon">
            <FaUser />
          </div>

          <div className="role-text">
            <h4>Wellness User</h4>
            <p>Discover health products and natural remedies.</p>
          </div>
        </div>

        {/* SPECIALIST */}
        <div
          className={`role-card ${role === "specialist" ? "active" : ""}`}
          onClick={() => setRole("specialist")}
        >
          <div className="role-icon">
            <FaUserMd />
          </div>

          <div className="role-text">
            <h4>Wellness Specialist</h4>
            <p>Provide consultation and holistic guidance.</p>
          </div>
        </div>

      </div>

      <button
        className="primary-btn"
        disabled={!role}
        onClick={nextStep}
      >
        Continue →
      </button>

    </div>
  );
};

export default StepRole;
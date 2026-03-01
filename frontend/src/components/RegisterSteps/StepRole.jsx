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
          <div className="role-circle">
            <FaUser />
          </div>

          <h4>Wellness User</h4>
          <p>
            Discover health products, remedies and expert advice.
          </p>
        </div>

        {/* SPECIALIST */}
        <div
          className={`role-card ${role === "specialist" ? "active" : ""}`}
          onClick={() => setRole("specialist")}
        >
          <div className="role-circle">
            <FaUserMd />
          </div>

          <h4>Wellness Specialist</h4>
          <p>
            Provide consultation, remedies and holistic guidance.
          </p>
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
import React from "react";
import {
  FaGlobe,
  FaMapMarkerAlt,
  FaCity,
  FaHome,
  FaMailBulk
} from "react-icons/fa";

const StepLocation = ({ formData, handleChange, nextStep, prevStep, role }) => {

  const { location } = formData;
  const { country, state, city, area, address, pincode } = location;

  const handleNext = () => {

    if (!country || !state || !city || !pincode) {
      alert("Please fill required location details.");
      return;
    }

    if (role === "user" && !area) {
      alert("Please enter your area.");
      return;
    }

    if (role === "specialist" && !address) {
      alert("Please enter your full address.");
      return;
    }

    nextStep();
  };

  return (
    <div className="step-content">

      <h2 className="form-title">Location Details</h2>
      <p className="form-subtitle">
        Tell us where you are located
      </p>

      <div className="form-grid">

        {/* COUNTRY */}
        <div className="input-group-advanced">
          <FaGlobe className="input-icon" />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={country}
            onChange={(e) => handleChange(e, "location")}
          />
        </div>

        {/* STATE */}
        <div className="input-group-advanced">
          <FaMapMarkerAlt className="input-icon" />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={state}
            onChange={(e) => handleChange(e, "location")}
          />
        </div>

        {/* CITY */}
        <div className="input-group-advanced">
          <FaCity className="input-icon" />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={city}
            onChange={(e) => handleChange(e, "location")}
          />
        </div>

        {/* AREA (USER ONLY) */}
        {role === "user" && (
          <div className="input-group-advanced">
            <FaHome className="input-icon" />
            <input
              type="text"
              name="area"
              placeholder="Area / Locality"
              value={area}
              onChange={(e) => handleChange(e, "location")}
            />
          </div>
        )}

        {/* ADDRESS (SPECIALIST ONLY) */}
        {role === "specialist" && (
          <div className="input-group-advanced full-width">
            <FaHome className="input-icon" />
            <input
              type="text"
              name="address"
              placeholder="Full Address"
              value={address}
              onChange={(e) => handleChange(e, "location")}
            />
          </div>
        )}

        {/* PINCODE */}
        <div className="input-group-advanced full-width">
          <FaMailBulk className="input-icon" />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => handleChange(e, "location")}
          />
        </div>

      </div>

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

export default StepLocation;
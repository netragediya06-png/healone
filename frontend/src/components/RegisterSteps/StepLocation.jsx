import React from "react";
import { FaMapMarkerAlt, FaCity, FaHome, FaMailBulk } from "react-icons/fa";

const StepLocation = ({ formData, handleChange, nextStep, prevStep }) => {
  const { location } = formData;
  const { state, city, address, pincode } = location;

  const handleNext = () => {
    if (!state || !city || !address || !pincode) {
      alert("Please fill all location details.");
      return;
    }
    nextStep();
  };

  return (
    <div className="step-content">

      <h2 className="form-title">Location Details</h2>
      <p className="form-subtitle">
        Let users know where you are located
      </p>

      <div className="form-grid">

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

        {/* ADDRESS */}
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

        {/* PINCODE */}
        <div className="input-group-advanced">
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

export default StepLocation;
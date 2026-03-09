import React from "react";
import {
  FaUpload,
  FaIdCard,
  FaCertificate,
  FaCheckCircle
} from "react-icons/fa";

const StepDocuments = ({ formData, handleChange, nextStep, prevStep }) => {

  const { documents } = formData;
  const { idProof, certificationProof } = documents;

  const handleFileChange = (e, fieldName) => {

    const file = e.target.files[0];

    if (file) {

      handleChange(
        {
          target: {
            name: fieldName,
            value: file.name
          }
        },
        "documents"
      );

    }
  };

  const handleNext = () => {

    if (!idProof || !certificationProof) {
      alert("Please upload required documents.");
      return;
    }

    nextStep();
  };

  return (
    <div className="step-content">

      <h2 className="form-title">Upload Documents</h2>

      <p className="form-subtitle">
        Admin will verify your credentials
      </p>

      <div className="upload-grid">

        {/* ID PROOF */}

        <div className="upload-card">

          <div className="upload-header">
            <FaIdCard />
            <span>ID Proof</span>
          </div>

          <p className="upload-desc">
            Aadhaar / PAN / Government ID
          </p>

          <label className="upload-box">

            <FaUpload />

            <span>Click to upload</span>

            <input
              type="file"
              onChange={(e) => handleFileChange(e, "idProof")}
            />

          </label>

          {idProof && (
            <div className="file-success">
              <FaCheckCircle /> {idProof}
            </div>
          )}

        </div>

        {/* CERTIFICATION */}

        <div className="upload-card">

          <div className="upload-header">
            <FaCertificate />
            <span>Certification Proof</span>
          </div>

          <p className="upload-desc">
            Professional qualification document
          </p>

          <label className="upload-box">

            <FaUpload />

            <span>Click to upload</span>

            <input
              type="file"
              onChange={(e) => handleFileChange(e, "certificationProof")}
            />

          </label>

          {certificationProof && (
            <div className="file-success">
              <FaCheckCircle /> {certificationProof}
            </div>
          )}

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

export default StepDocuments;
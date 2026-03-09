import React from "react";

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="stepper">
      {steps.map((label, index) => {
        const status =
          index < currentStep
            ? "completed"
            : index === currentStep
            ? "active"
            : "pending";

        return (
          <div className={`step ${status}`} key={index}>
            <div className="circle">
              {status === "completed" ? "✓" : index + 1}
            </div>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper; 
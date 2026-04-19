// src/user/pages/specialist-register/SpecialistRegister.tsx

import { useSpecialistForm } from "./hooks/useSpecialistForm";

import Stepper from "./components/Stepper";
import { STEPS } from "./constants";

import StepBasic from "./steps/StepBasic";
import StepLocation from "./steps/StepLocation";
import StepProfessional from "./steps/StepProfessional";
import StepProfile from "./steps/StepProfile";
import StepDocuments from "./steps/StepDocuments";
import StepAvailability from "./steps/StepAvailability";
import StepReview from "./steps/StepReview";

export default function SpecialistRegister() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const {
    step,
    form,
    nextStep,
    prevStep,
    updateField,
  } = useSpecialistForm();

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <StepBasic
            form={form}
            updateField={updateField}
            onNext={nextStep}
          />
        );

      case 1:
        return (
          <StepLocation
            form={form}
            updateField={updateField}
            onNext={nextStep}
          />
        );

      case 2:
        return (
          <StepProfessional
            form={form}
            updateField={updateField}
            onNext={nextStep}
          />
        );

      case 3:
        return (
          <StepProfile
            form={form}
            updateField={updateField}
            onNext={nextStep}
          />
        );

      case 4:
        return (
          <StepDocuments
            form={form}
            updateField={updateField}
            onNext={nextStep}
          />
        );

      case 5:
        return (
          <StepAvailability
            form={form}
            updateField={updateField}
            onNext={nextStep}
          />
        );

      case 6:
        return <StepReview form={form} />;

      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* 🔥 USER INFO */}
<div className="bg-gray-100 p-4 rounded-lg mb-6">
  <p className="text-sm text-gray-500">Applying as:</p>
  <p className="font-semibold">{user.fullName}</p>
  <p className="text-xs text-gray-500">{user.email}</p>
</div>

      {/* 🔥 Stepper */}
      <Stepper steps={STEPS} currentStep={step} />

      {/* STEP CONTENT */}
      {renderStep()}

      {/* 🔙 BACK BUTTON ONLY */}
      {step > 0 && step < 6 && (
        <div className="mt-6">
          <button
            onClick={prevStep}
            className="px-4 py-2 border rounded"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
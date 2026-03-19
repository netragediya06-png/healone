// src/user/pages/specialist-register/steps/StepProfessional.tsx

import { useState } from "react";

interface Props {
  form: any;
  updateField: (name: string, value: any) => void;
  onNext: () => void;
}

export default function StepProfessional({
  form,
  updateField,
  onNext,
}: Props) {
  const [errors, setErrors] = useState<any>({});

  // =========================
  // VALIDATION
  // =========================
  const validateAndNext = () => {
    let newErrors: any = {};

    if (!form.organizationName?.trim()) {
      newErrors.organizationName = "Organization name required";
    }

    if (!form.organizationType) {
      newErrors.organizationType = "Organization type required";
    }

    if (!form.experienceYears || form.experienceYears <= 0) {
      newErrors.experienceYears = "Valid experience required";
    }

    if (!form.specialization?.trim()) {
      newErrors.specialization = "Specialization required";
    }

    if (!form.consultationMode) {
      newErrors.consultationMode = "Select consultation mode";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  // =========================
  // LIVE VALIDATION
  // =========================
  const handleBlur = () => {
    let newErrors: any = {};

    if (!form.organizationName?.trim()) newErrors.organizationName = "Required";
    if (!form.organizationType) newErrors.organizationType = "Required";
    if (!form.experienceYears || form.experienceYears <= 0)
      newErrors.experienceYears = "Invalid";
    if (!form.specialization?.trim()) newErrors.specialization = "Required";
    if (!form.consultationMode) newErrors.consultationMode = "Required";

    setErrors(newErrors);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Professional Details</h2>

      {/* ORGANIZATION NAME */}
      <div>
        <label>Organization Name</label>
        <input
          type="text"
          value={form.organizationName || ""}
          onChange={(e) =>
            updateField("organizationName", e.target.value)
          }
          onBlur={handleBlur}
          className="w-full border p-2 rounded"
        />
        {errors.organizationName && (
          <p className="text-red-500 text-sm">{errors.organizationName}</p>
        )}
      </div>

      {/* ORGANIZATION TYPE */}
      <div>
        <label>Organization Type</label>
        <select
          value={form.organizationType || ""}
          onChange={(e) =>
            updateField("organizationType", e.target.value)
          }
          onBlur={handleBlur}
          className="w-full border p-2 rounded"
        >
          <option value="">Select</option>
          <option value="clinic">Clinic</option>
          <option value="hospital">Hospital</option>
          <option value="academy">Academy</option>
          <option value="sanstha">Sanstha</option>
          <option value="panchakarma_center">Panchakarma Center</option>
        </select>
        {errors.organizationType && (
          <p className="text-red-500 text-sm">{errors.organizationType}</p>
        )}
      </div>

      {/* EXPERIENCE */}
      <div>
        <label>Experience (Years)</label>
        <input
          type="number"
          value={form.experienceYears || ""}
          onChange={(e) =>
            updateField("experienceYears", Number(e.target.value))
          }
          onBlur={handleBlur}
          className="w-full border p-2 rounded"
        />
        {errors.experienceYears && (
          <p className="text-red-500 text-sm">{errors.experienceYears}</p>
        )}
      </div>

      {/* PRACTITIONERS */}
      <div>
        <label>Practitioners Count</label>
        <input
          type="number"
          value={form.practitionersCount || ""}
          onChange={(e) =>
            updateField("practitionersCount", Number(e.target.value))
          }
          className="w-full border p-2 rounded"
        />
      </div>

      {/* SERVICES */}
      <div>
        <label>Services Offered (comma separated)</label>
        <input
          type="text"
          value={form.servicesOffered || ""}
          onChange={(e) =>
            updateField(
              "servicesOffered",
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          className="w-full border p-2 rounded"
        />
      </div>

      {/* SPECIALIZATION */}
      <div>
        <label>Specialization</label>
        <input
          type="text"
          value={form.specialization || ""}
          onChange={(e) =>
            updateField("specialization", e.target.value)
          }
          onBlur={handleBlur}
          className="w-full border p-2 rounded"
        />
        {errors.specialization && (
          <p className="text-red-500 text-sm">{errors.specialization}</p>
        )}
      </div>

      {/* CONSULTATION MODE */}
      <div>
        <label>Consultation Mode</label>
        <select
          value={form.consultationMode || ""}
          onChange={(e) =>
            updateField("consultationMode", e.target.value)
          }
          onBlur={handleBlur}
          className="w-full border p-2 rounded"
        >
          <option value="">Select</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="both">Both</option>
        </select>
        {errors.consultationMode && (
          <p className="text-red-500 text-sm">{errors.consultationMode}</p>
        )}
      </div>

      {/* FEES */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Online Fees</label>
          <input
            type="number"
            value={form.onlineFees || ""}
            onChange={(e) =>
              updateField("onlineFees", Number(e.target.value))
            }
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Offline Fees</label>
          <input
            type="number"
            value={form.offlineFees || ""}
            onChange={(e) =>
              updateField("offlineFees", Number(e.target.value))
            }
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-end pt-4">
        <button
          onClick={validateAndNext}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}
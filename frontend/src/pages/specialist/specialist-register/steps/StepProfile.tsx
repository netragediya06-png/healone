// src/user/pages/specialist-register/steps/StepProfile.tsx

import { useState } from "react";

interface Props {
  form: any;
  updateField: (name: string, value: any) => void;
  onNext: () => void; // ✅ added
}

export default function StepProfile({
  form,
  updateField,
  onNext,
}: Props) {
  const [errors, setErrors] = useState<any>({});

  const validateAndNext = () => {
    let newErrors: any = {};

    if (!form.bio.trim()) {
      newErrors.bio = "Bio is required";
    }

    if (!form.expertiseSummary.trim()) {
      newErrors.expertiseSummary = "Expertise summary required";
    }

    if (!form.treatmentApproach.trim()) {
      newErrors.treatmentApproach = "Treatment approach required";
    }

    if (!form.languagesSpoken.trim()) {
      newErrors.languagesSpoken = "Languages required";
    }

    setErrors(newErrors);

    // ✅ go next only if valid
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const handleBlur = () => {
    let newErrors: any = {};

    if (!form.bio.trim()) newErrors.bio = "Required";
    if (!form.expertiseSummary.trim()) newErrors.expertiseSummary = "Required";
    if (!form.treatmentApproach.trim()) newErrors.treatmentApproach = "Required";
    if (!form.languagesSpoken.trim()) newErrors.languagesSpoken = "Required";

    setErrors(newErrors);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Profile Details</h2>

      {/* BIO */}
      <div>
        <label>Short Bio</label>
        <textarea
          value={form.bio}
          onChange={(e) => updateField("bio", e.target.value)}
          onBlur={handleBlur}
          rows={3}
          className="w-full border p-2 rounded"
          placeholder="Tell users about yourself..."
        />
        {errors.bio && (
          <p className="text-red-500 text-sm">{errors.bio}</p>
        )}
      </div>

      {/* EXPERTISE */}
      <div>
        <label>Expertise Summary</label>
        <textarea
          value={form.expertiseSummary}
          onChange={(e) =>
            updateField("expertiseSummary", e.target.value)
          }
          onBlur={handleBlur}
          rows={3}
          className="w-full border p-2 rounded"
          placeholder="Your main expertise areas..."
        />
        {errors.expertiseSummary && (
          <p className="text-red-500 text-sm">
            {errors.expertiseSummary}
          </p>
        )}
      </div>

      {/* TREATMENT */}
      <div>
        <label>Treatment Approach</label>
        <textarea
          value={form.treatmentApproach}
          onChange={(e) =>
            updateField("treatmentApproach", e.target.value)
          }
          onBlur={handleBlur}
          rows={3}
          className="w-full border p-2 rounded"
          placeholder="How do you treat patients?"
        />
        {errors.treatmentApproach && (
          <p className="text-red-500 text-sm">
            {errors.treatmentApproach}
          </p>
        )}
      </div>

      {/* LANGUAGES */}
      <div>
        <label>Languages Spoken</label>
        <input
          type="text"
          value={form.languagesSpoken}
          onChange={(e) =>
            updateField("languagesSpoken", e.target.value)
          }
          onBlur={handleBlur}
          className="w-full border p-2 rounded"
          placeholder="e.g. English, Hindi, Gujarati"
        />
        {errors.languagesSpoken && (
          <p className="text-red-500 text-sm">
            {errors.languagesSpoken}
          </p>
        )}
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
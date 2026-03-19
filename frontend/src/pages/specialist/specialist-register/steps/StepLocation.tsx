// src/user/pages/specialist-register/steps/StepLocation.tsx

import { useState } from "react";

interface Props {
  form: any;
  updateField: (name: string, value: any) => void;
  onNext: () => void; // ✅ added
}

export default function StepLocation({
  form,
  updateField,
  onNext,
}: Props) {
  const [errors, setErrors] = useState<any>({});

  const validateAndNext = () => {
    let newErrors: any = {};

    if (!form.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!form.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);

    // ✅ go next only if valid
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const handleBlur = () => {
    let newErrors: any = {};

    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Location Details</h2>

      {/* STATE */}
      <div>
        <label className="block text-sm font-medium">State</label>
        <input
          type="text"
          value={form.state}
          onChange={(e) => updateField("state", e.target.value)}
          onBlur={handleBlur}
          className="w-full border rounded-lg p-2"
        />
        {errors.state && (
          <p className="text-red-500 text-sm">{errors.state}</p>
        )}
      </div>

      {/* CITY */}
      <div>
        <label className="block text-sm font-medium">City</label>
        <input
          type="text"
          value={form.city}
          onChange={(e) => updateField("city", e.target.value)}
          onBlur={handleBlur}
          className="w-full border rounded-lg p-2"
        />
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city}</p>
        )}
      </div>

      {/* ADDRESS */}
      <div>
        <label className="block text-sm font-medium">Address</label>
        <textarea
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          onBlur={handleBlur}
          className="w-full border rounded-lg p-2"
          rows={3}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
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
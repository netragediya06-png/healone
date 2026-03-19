import { useState } from "react";

const DAYS = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
];

interface Props {
  form: any;
  updateField: (name: string, value: any) => void;
  onNext: () => void;
}

export default function StepAvailability({
  form,
  updateField,
  onNext,
}: Props) {
  const [errors, setErrors] = useState<any>({});

  const toggleDay = (day: string) => {
    const updatedDays = form.days.includes(day)
      ? form.days.filter((d: string) => d !== day)
      : [...form.days, day];

    updateField("days", updatedDays);
  };

  const validateAndNext = () => {
    let newErrors: any = {};

    if (form.days.length === 0) {
      newErrors.days = "Select at least one day";
    }

    if (!form.startTime) {
      newErrors.startTime = "Start time required";
    }

    if (!form.endTime) {
      newErrors.endTime = "End time required";
    }

    if (
      form.startTime &&
      form.endTime &&
      form.startTime >= form.endTime
    ) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">

      <h2 className="text-xl font-semibold">Availability</h2>

      {/* DAYS */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Select Available Days
        </label>

        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-all
                ${
                  form.days.includes(day)
                    ? "bg-blue-600 text-white border-blue-600 shadow"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {day}
            </button>
          ))}
        </div>

        {errors.days && (
          <p className="text-red-500 text-xs mt-1">{errors.days}</p>
        )}
      </div>

      {/* TIME */}
      <div className="grid grid-cols-2 gap-4">

        {/* START TIME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Start Time
          </label>

          <input
            type="time"
            value={form.startTime}
            onChange={(e) => updateField("startTime", e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2
              ${
                errors.startTime
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
          />

          {errors.startTime && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startTime}
            </p>
          )}
        </div>

        {/* END TIME */}
        <div>
          <label className="block text-sm font-medium mb-1">
            End Time
          </label>

          <input
            type="time"
            value={form.endTime}
            onChange={(e) => updateField("endTime", e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2
              ${
                errors.endTime
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-300"
              }`}
          />

          {errors.endTime && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endTime}
            </p>
          )}
        </div>

      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-end">
        <button
          onClick={validateAndNext}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-2 rounded-lg shadow"
        >
          Next
        </button>
      </div>
    </div>
  );
}
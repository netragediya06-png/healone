// src/user/pages/specialist-register/steps/StepBasic.tsx

import { useRef, useState } from "react";
import { Camera } from "lucide-react";

interface Props {
  form: any;
  updateField: (name: string, value: any) => void;
  onNext: () => void;
}

export default function StepBasic({ form, updateField, onNext }: Props) {
  const [errors, setErrors] = useState<any>({});
  const fileRef = useRef<HTMLInputElement | null>(null);

  // 🔥 open file picker on avatar click
  const handleImageClick = () => {
    fileRef.current?.click();
  };

  // 🔥 handle file select
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      updateField("profilePhoto", file);
    }
  };

  const validateAndNext = () => {
    let newErrors: any = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!form.email.includes("@")) {
      newErrors.email = "Valid email required";
    }

    if (!form.phone || form.phone.length < 10) {
      newErrors.phone = "Valid phone number required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  const handleBlur = () => {
    let newErrors: any = {};

    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.email.includes("@")) newErrors.email = "Valid email required";
    if (!form.phone || form.phone.length < 10)
      newErrors.phone = "Valid phone number required";

    setErrors(newErrors);
  };

  return (
    <div className="space-y-6">

      <h2 className="text-xl font-semibold">Basic Information</h2>

      {/* 🔥 PROFILE IMAGE */}
      <div className="flex flex-col items-center gap-3">

        <div
          onClick={handleImageClick}
          className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300 cursor-pointer group"
        >
          {form.profilePhoto ? (
            <img
              src={URL.createObjectURL(form.profilePhoto)}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Upload
            </div>
          )}

          {/* 🔥 Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
            <Camera className="text-white" size={20} />
          </div>
        </div>

        {/* 🔥 Hidden Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          onChange={handleImageChange}
          className="hidden"
        />

        <p className="text-xs text-gray-500">
          Click to upload profile photo
        </p>
      </div>

      {/* FULL NAME */}
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={form.fullName}
          onChange={(e) => updateField("fullName", e.target.value)}
          onBlur={handleBlur}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName}</p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          onBlur={handleBlur}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>

      {/* PHONE */}
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          onBlur={handleBlur}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-300"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone}</p>
        )}
      </div>

      {/* NEXT BUTTON */}
      <div className="flex justify-end pt-4">
        <button
          onClick={validateAndNext}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

    </div>
  );
}
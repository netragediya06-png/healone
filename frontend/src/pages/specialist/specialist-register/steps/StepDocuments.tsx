// src/user/pages/specialist-register/steps/StepDocuments.tsx

import { useState } from "react";

interface Props {
  form: any;
  updateField: (name: string, value: any) => void;
  onNext: () => void; // ✅ added
}

export default function StepDocuments({
  form,
  updateField,
  onNext,
}: Props) {
  const [error, setError] = useState("");

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // ✅ Max 5 files
    if (files.length + form.documents.length > 5) {
      setError("Maximum 5 documents allowed");
      return;
    }

    // ✅ Validate type & size
    for (let file of files as File[]) {
      if (
        !file.type.includes("pdf") &&
        !file.type.includes("image")
      ) {
        setError("Only PDF or image files allowed");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError("File size must be less than 2MB");
        return;
      }
    }

    setError("");

    updateField("documents", [...form.documents, ...files]);
  };

  const removeFile = (index: number) => {
    const updated = form.documents.filter((_: any, i: number) => i !== index);
    updateField("documents", updated);
  };

  const validateAndNext = () => {
    if (form.documents.length === 0) {
      setError("Please upload at least one document");
      return;
    }

    setError("");
    onNext(); // ✅ move next
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Upload Documents</h2>

      {/* FILE INPUT */}
      <div>
        <label className="block mb-2">
          Upload Certificates / License / ID Proof
        </label>

        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full border p-2 rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      {/* FILE LIST */}
      <div className="space-y-2">
        {form.documents.map((file: any, index: number) => (
          <div
            key={index}
            className="flex justify-between items-center border p-2 rounded"
          >
            <span className="text-sm">{file.name}</span>

            <button
              type="button"
              onClick={() => removeFile(index)}
              className="text-red-500 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
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
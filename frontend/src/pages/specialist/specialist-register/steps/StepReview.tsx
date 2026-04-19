// src/user/pages/specialist-register/steps/StepReview.tsx

import { becomeSpecialist } from "../../../../services/authService";
import { useState } from "react";

interface Props {
  form: any;
}

export default function StepReview({ form }: Props) {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

const handleSubmit = async () => {
  try {
    setLoading(true);

    const formData = new FormData();

    // ======================
    // TEXT FIELDS
    // ======================
    formData.append("organizationName", form.organizationName || "");
    formData.append("organizationType", form.organizationType || "");
    formData.append("experienceYears", form.experienceYears?.toString() || "");
    formData.append("practitionersCount", form.practitionersCount?.toString() || "");
    formData.append("servicesOffered", form.servicesOffered || "");
    formData.append("specialization", form.specialization || "");
    formData.append("consultationMode", form.consultationMode || "");
    formData.append("onlineFees", form.onlineFees?.toString() || "");
    formData.append("offlineFees", form.offlineFees?.toString() || "");

    formData.append("qualification", form.qualification || "");
    formData.append("university", form.university || "");
    formData.append("yearOfCompletion", form.yearOfCompletion?.toString() || "");

    formData.append("bio", form.bio || "");
    formData.append("expertiseSummary", form.expertiseSummary || "");
    formData.append("treatmentApproach", form.treatmentApproach || "");
    formData.append("languagesSpoken", form.languagesSpoken || "");

    formData.append("startTime", form.startTime || "");
    formData.append("endTime", form.endTime || "");

    // ✅ ARRAY
    formData.append("days", JSON.stringify(form.days || []));

    // ======================
    // FILES (VERY IMPORTANT)
    // ======================

    // ✅ Profile Photo
    if (form.profilePhoto) {
      formData.append("profilePhoto", form.profilePhoto);
    }

    // ✅ Documents
    if (form.documents && form.documents.length > 0) {
      form.documents.forEach((file: File) => {
        formData.append("documents", file);
      });
    }

    // ======================
    // API CALL
    // ======================
    const res = await becomeSpecialist(formData);

    setMessage(
  "Your application has been submitted successfully. Please wait 24 hours for admin approval."
);

  } catch (error: any) {
    setMessage(error.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review & Submit</h2>

      {/* BASIC */}
      <div>
        <h3 className="font-semibold">Basic Info</h3>
        <p>{user.fullName}</p>
        <p>{user.email}</p>
        <p>{form.phone}</p> 
      </div>

      {/* LOCATION */}
      <div>
        <h3 className="font-semibold">Location</h3>
        <p>{form.state}, {form.city}</p>
        <p>{form.address}</p>
      </div>

      {/* PROFESSIONAL */}
      <div>
        <h3 className="font-semibold">Professional</h3>
        <p>{form.organizationName}</p>
        <p>{form.specialization}</p>
        <p>{form.experienceYears} years</p>
        <p>Mode: {form.consultationMode}</p>
        <p>Fees: ₹{form.onlineFees} / ₹{form.offlineFees}</p>
      </div>

      {/* PROFILE */}
      <div>
        <h3 className="font-semibold">Profile</h3>
        <p>{form.bio}</p>
        <p>{form.expertiseSummary}</p>
      </div>

      {/* AVAILABILITY */}
      <div>
        <h3 className="font-semibold">Availability</h3>
        <p>{form.days.join(", ")}</p>
        <p>{form.startTime} - {form.endTime}</p>
      </div>

      {/* DOCUMENTS */}
      <div>
        <h3 className="font-semibold">Documents</h3>
        {form.documents.map((file: any, i: number) => (
          <p key={i}>{file.name}</p>
        ))}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>

      {/* MESSAGE */}
      {message && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-lg">
  {message}
</div>
      )}
    </div>
  );
}
import { useState } from "react";
import { registerUser } from "../../services/authService";

// =====================
// TYPES
// =====================

interface ErrorType {
  [key: string]: string;
}

interface FormType {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;

  location: {
    state: string;
    city: string;
    address: string;
    pincode: string;
  };

  organizationDetails: {
    organizationName: string;
    organizationType: string;
    experienceYears: string;
    practitionersCount: string;
    servicesOffered: string;
    specialization: string;
    consultationMode: string;
    pricing: {
      online: string;
      offline: string;
    };
  };

  professionalDetails: {
    qualification: string;
    university: string;
    yearOfCompletion: string;
  };

  documents: {
    idProof: File | null;
    degreeCertificate: File | null;
    licenseCertificate: File | null;
    clinicProof: File | null;
  };

  bio: string;
  expertiseSummary: string;
  treatmentApproach: string;
  languagesSpoken: string;

  availability: {
    days: string;
    startTime: string;
    endTime: string;
  };

  profilePhoto: File | null;
}

// =====================
// COMPONENT
// =====================

export default function SpecialistRegister() {
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<ErrorType>({});

  const [form, setForm] = useState<FormType>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "specialist",

    location: {
      state: "",
      city: "",
      address: "",
      pincode: "",
    },

    organizationDetails: {
      organizationName: "",
      organizationType: "",
      experienceYears: "",
      practitionersCount: "",
      servicesOffered: "",
      specialization: "",
      consultationMode: "online",
      pricing: {
        online: "",
        offline: "",
      },
    },

    professionalDetails: {
      qualification: "",
      university: "",
      yearOfCompletion: "",
    },

    documents: {
      idProof: null,
      degreeCertificate: null,
      licenseCertificate: null,
      clinicProof: null,
    },

    bio: "",
    expertiseSummary: "",
    treatmentApproach: "",
    languagesSpoken: "",

    availability: {
      days: "",
      startTime: "",
      endTime: "",
    },

    profilePhoto: null,
  });

  // =====================
  // HANDLE CHANGE
  // =====================

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  section?: keyof FormType,
  nested?: string
) => {
  const { name, value } = e.target;

  setForm((prev) => {
    // LEVEL 3 (nested inside nested)
    if (section && nested) {
      const sectionData = prev[section] as Record<string, any>;
      const nestedData = sectionData[nested] as Record<string, any>;

      return {
        ...prev,
        [section]: {
          ...sectionData,
          [nested]: {
            ...nestedData,
            [name]: value,
          },
        },
      };
    }

    // LEVEL 2 (nested)
    if (section) {
      const sectionData = prev[section] as Record<string, any>;

      return {
        ...prev,
        [section]: {
          ...sectionData,
          [name]: value,
        },
      };
    }

    // LEVEL 1 (normal)
    return {
      ...prev,
      [name]: value,
    };
  });
};

  // =====================
  // FILE HANDLER
  // =====================

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof FormType["documents"]
  ) => {
    if (!e.target.files) return;

    setForm((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [field]: e.target.files![0],
      },
    }));
  };

  const handleProfile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setForm((prev) => ({
      ...prev,
      profilePhoto: e.target.files![0],
    }));
  };

  // =====================
  // VALIDATION
  // =====================

  const validateStep = () => {
    const err: ErrorType = {};

    if (step === 1) {
      if (!form.fullName) err.fullName = "Required";
      if (!form.email) err.email = "Required";
      if (!form.password) err.password = "Required";
      if (!form.phone) err.phone = "Required";
    }

    if (step === 2) {
      if (!form.location.state) err.state = "Required";
      if (!form.location.city) err.city = "Required";
      if (!form.location.address) err.address = "Required";
    }

    if (step === 3) {
      if (!form.organizationDetails.organizationName)
        err.organizationName = "Required";
      if (!form.organizationDetails.experienceYears)
        err.experienceYears = "Required";
    }

    if (step === 4) {
      if (!form.professionalDetails.qualification)
        err.qualification = "Required";
    }

    if (step === 5) {
      if (!form.documents.idProof) err.idProof = "Required";
      if (!form.documents.degreeCertificate) err.degree = "Required";
      if (!form.documents.licenseCertificate) err.license = "Required";
      if (!form.documents.clinicProof) err.clinic = "Required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const prev = () => setStep((prev) => prev - 1);

  // =====================
  // SUBMIT
  // =====================

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const formData = new FormData();

    formData.append("fullName", form.fullName);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("phone", form.phone);
    formData.append("role", "specialist");

    formData.append("location", JSON.stringify(form.location));

    formData.append(
      "organizationDetails",
      JSON.stringify({
        ...form.organizationDetails,
        servicesOffered: form.organizationDetails.servicesOffered.split(","),
        specialization: form.organizationDetails.specialization.split(","),
      })
    );

    formData.append(
      "professionalDetails",
      JSON.stringify(form.professionalDetails)
    );

    formData.append(
      "availability",
      JSON.stringify({
        ...form.availability,
        days: form.availability.days.split(","),
      })
    );

    formData.append(
      "languagesSpoken",
      JSON.stringify(form.languagesSpoken.split(","))
    );

    formData.append("bio", form.bio);
    formData.append("expertiseSummary", form.expertiseSummary);
    formData.append("treatmentApproach", form.treatmentApproach);

    if (form.profilePhoto) formData.append("profilePhoto", form.profilePhoto);
    if (form.documents.idProof)
      formData.append("idProof", form.documents.idProof);
    if (form.documents.degreeCertificate)
      formData.append("degreeCertificate", form.documents.degreeCertificate);
    if (form.documents.licenseCertificate)
      formData.append("licenseCertificate", form.documents.licenseCertificate);
    if (form.documents.clinicProof)
      formData.append("clinicProof", form.documents.clinicProof);

    await registerUser(formData);
    alert("Submitted! Waiting for admin approval 🚀");
  };

  // =====================
  // UI
  // =====================

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl">

        <h2 className="text-2xl font-bold text-center mb-6">
          Specialist Registration
        </h2>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input name="fullName" placeholder="Full Name" onChange={(e) => handleChange(e)} className="input" />
            {errors.fullName && <p className="text-red-500">{errors.fullName}</p>}

            <input name="email" placeholder="Email" onChange={(e) => handleChange(e)} className="input" />
            <input name="password" type="password" placeholder="Password" onChange={(e) => handleChange(e)} className="input" />
            <input name="phone" placeholder="Phone" onChange={(e) => handleChange(e)} className="input" />
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <p className="font-semibold mb-2">Upload Documents</p>

            <input type="file" onChange={(e) => handleFile(e, "idProof")} />
            {errors.idProof && <p className="text-red-500">{errors.idProof}</p>}

            <input type="file" onChange={(e) => handleFile(e, "degreeCertificate")} />
            <input type="file" onChange={(e) => handleFile(e, "licenseCertificate")} />
            <input type="file" onChange={(e) => handleFile(e, "clinicProof")} />
          </>
        )}

        {/* NAV */}
        <div className="flex justify-between mt-6">
          {step > 1 && <button onClick={prev}>Back</button>}
          {step < 5 && <button onClick={next}>Next</button>}
          {step === 5 && <button onClick={handleSubmit}>Submit</button>}
        </div>
      </div>
    </div>
  );
}
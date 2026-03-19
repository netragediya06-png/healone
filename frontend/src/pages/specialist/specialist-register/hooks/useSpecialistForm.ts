import { useState } from "react";
import { SpecialistFormType } from "../types";

export const useSpecialistForm = () => {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState<SpecialistFormType>({
    profilePhoto: null,
    fullName: "",
    email: "",
    phone: "",

    state: "",
    city: "",
    address: "",

    organizationName: "",
    organizationType: "",
    experienceYears: 0,
    practitionersCount: 0,
    servicesOffered: "",
    specialization: "",
    consultationMode: "",
    onlineFees: 0,
    offlineFees: 0,

    qualification: "",
    university: "",
    yearOfCompletion: "",

    bio: "",
    expertiseSummary: "",
    treatmentApproach: "",
    languagesSpoken: "",

    days: [],
    startTime: "",
    endTime: "",

    documents: [],
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateField = (name: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    step,
    form,
    setForm,
    nextStep,
    prevStep,
    updateField,
  };
};
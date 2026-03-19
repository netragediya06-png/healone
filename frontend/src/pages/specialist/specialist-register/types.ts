// src/user/pages/specialist-register/types.ts

export interface SpecialistFormType {
  // BASIC
  profilePhoto: File | null;
  fullName: string;
  email: string;
  phone: string;

  // LOCATION
  state: string;
  city: string;
  address: string;

  // ORGANIZATION
  organizationName: string;
  organizationType: string;
  experienceYears: number;
  practitionersCount: number;
  servicesOffered: string;
  specialization: string;
  consultationMode: string;
  onlineFees: number;
  offlineFees: number;

  // PROFESSIONAL
  qualification: string;
  university: string;
  yearOfCompletion: string;

  // PROFILE
  bio: string;
  expertiseSummary: string;
  treatmentApproach: string;
  languagesSpoken: string;

  // AVAILABILITY
  days: string[];
  startTime: string;
  endTime: string;

  // DOCUMENTS 🔥
  documents: File[];
}
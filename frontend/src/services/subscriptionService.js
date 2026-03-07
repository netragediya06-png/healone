import API from "../api/api";

// ==============================
// USER ENROLL PROGRAM
// ==============================
export const enrollProgram = (programId) =>
  API.post("/subscriptions", { programId });

// ==============================
// USER PROGRAMS
// ==============================
export const getMyPrograms = () =>
  API.get("/subscriptions/my");

// ==============================
// ADMIN VIEW ALL
// ==============================
export const getAllSubscriptions = () =>
  API.get("/subscriptions/admin/all");
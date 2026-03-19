import API from "./api";

// ==============================
// USER SUBSCRIBE PROGRAM
// ==============================
export const subscribeProgram = (data) =>
  API.post("/subscriptions", data);

// Example usage:
// subscribeProgram({ programId, plan })

// ==============================
// USER SUBSCRIPTIONS
// ==============================
export const getMySubscriptions = () =>
  API.get("/subscriptions/my");

// ==============================
// ADMIN VIEW ALL SUBSCRIPTIONS
// ==============================
export const getAllSubscriptions = () =>
  API.get("/subscriptions/admin/all");

// ==============================
// CHECK PROGRAM ACCESS
// ==============================
export const checkProgramAccess = (programId) =>
  API.get(`/subscriptions/access/${programId}`);
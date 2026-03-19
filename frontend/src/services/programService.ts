import API from "./api";

// ==============================
// GET ALL APPROVED PROGRAMS (USER)
// ==============================
export const getPrograms = () =>
  API.get("/programs/approved");

// ==============================
// GET ALL PROGRAMS (ADMIN)
// ==============================
export const getAdminPrograms = () =>
  API.get("/programs/admin/all");

// ==============================
// GET MY PROGRAMS (SPECIALIST)
// ==============================
export const getMyPrograms = () =>
  API.get("/programs/my-programs");

// ==============================
// CREATE PROGRAM (SPECIALIST)
// ==============================
export const createProgram = (data: FormData) =>
  API.post("/programs/create", data);

// ==============================
// UPDATE PROGRAM
// ==============================
export const updateProgram = (id: string, data: FormData) =>
  API.put(`/programs/update/${id}`, data);

// ==============================
// DELETE PROGRAM
// ==============================
export const deleteProgram = (id: string) =>
  API.delete(`/programs/delete/${id}`);

// ==============================
// ADMIN APPROVE PROGRAM
// ==============================
export const approveProgram = (id: string) =>
  API.put(`/programs/status/${id}`, {
    status: "approved",
  });

// ==============================
// ADMIN REJECT PROGRAM
// ==============================
export const rejectProgram = (id: string, feedback: string) =>
  API.put(`/programs/status/${id}`, {
    status: "rejected",
    adminFeedback: feedback,
  });

// ==============================
// GET SINGLE PROGRAM
// ==============================
export const getProgram = (id: string) =>
  API.get(`/programs/${id}`);


// =====================================================
// 🔥 NEW: SUBSCRIPTION SYSTEM
// =====================================================

// ==============================
// USER SUBSCRIBE PROGRAM
// ==============================
export const subscribeProgram = (data: {
  programId: string;
  plan: string;
}) =>
  API.post("/subscriptions", data);

// ==============================
// GET USER SUBSCRIPTIONS
// ==============================
export const getMySubscriptions = () =>
  API.get("/subscriptions/my");

// ==============================
// CHECK PROGRAM ACCESS
// ==============================
export const checkProgramAccess = (programId: string) =>
  API.get(`/subscriptions/access/${programId}`);
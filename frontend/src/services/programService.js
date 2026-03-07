import API from "./api";

// ==============================
// GET ALL APPROVED PROGRAMS
// ==============================
export const getPrograms = () => API.get("/programs");

// ==============================
// GET SINGLE PROGRAM
// ==============================
export const getProgram = (id) => API.get(`/programs/${id}`);

// ==============================
// ADMIN - GET ALL PROGRAMS
// ==============================
export const getAdminPrograms = () => API.get("/programs/admin/all");

// ==============================
// SPECIALIST - CREATE PROGRAM
// ==============================
export const createProgram = (data) =>
  API.post("/programs", data);

// ==============================
// UPDATE PROGRAM
// ==============================
export const updateProgram = (id, data) =>
  API.put(`/programs/${id}`, data);

// ==============================
// DELETE PROGRAM
// ==============================
export const deleteProgram = (id) =>
  API.delete(`/programs/${id}`);

// ==============================
// APPROVE PROGRAM
// ==============================
export const approveProgram = (id) =>
  API.put(`/programs/approve/${id}`);
/* REJECT PROGRAM */
export const rejectProgram = (id) =>
  API.put(`/programs/reject/${id}`);
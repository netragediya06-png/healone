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
export const createProgram = (data) =>
  API.post("/programs/create", data);


// ==============================
// UPDATE PROGRAM
// ==============================
export const updateProgram = (id, data) =>
  API.put(`/programs/update/${id}`, data);


// ==============================
// DELETE PROGRAM
// ==============================
export const deleteProgram = (id) =>
  API.delete(`/programs/delete/${id}`);


// ==============================
// ADMIN APPROVE PROGRAM
// ==============================
export const approveProgram = (id) =>
  API.put(`/programs/status/${id}`, {
    status: "approved"
  });


// ==============================
// GET SINGLE PROGRAM
// ==============================
export const getProgram = (id) =>
  API.get(`/programs/${id}`);


// ==============================
// ADMIN REJECT PROGRAM
// ==============================
export const rejectProgram = (id, feedback) =>
  API.put(`/programs/status/${id}`, {
    status: "rejected",
    adminFeedback: feedback
  });


// ==============================
// USER ENROLL PROGRAM
// ==============================
export const enrollProgram = (id) =>
  API.post(`/programs/enroll/${id}`);
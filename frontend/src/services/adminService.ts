import API from "./api";

/* ===============================
   GET SPECIALISTS (DYNAMIC)
=============================== */
export const getSpecialists = async (status?: string) => {
  const url = status
    ? `/specialists?status=${status}`   // ✅ FIXED
    : `/specialists`;                  // ✅ FIXED

  const res = await API.get(url);
  return res.data;
};

/* ===============================
   APPROVE SPECIALIST
=============================== */
export const approveSpecialist = async (id: string) => {
  const res = await API.put(
    `/specialists/approve/${id}`,   // ✅ FIXED
    {}
  );
  return res.data;
};
export const becomeSpecialist = async (data: FormData) => {
  const res = await API.post(
    "/specialists/become-specialist",
    data,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        // ❌ DO NOT add Content-Type here
      },
    }
  );

  return res.data;
};

/* ===============================
   REJECT SPECIALIST
=============================== */
export const rejectSpecialist = async (id: string, reason: string) => {
  const res = await API.put(
    `/specialists/reject/${id}`,   // ✅ FIXED
    { reason }
  );
  return res.data;
};

export default {
  getSpecialists,
  approveSpecialist,
  rejectSpecialist,
  becomeSpecialist
};
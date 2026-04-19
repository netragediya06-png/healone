import API from "./api";

// PRODUCTS
export const getFeaturedProducts = async () => {
  const res = await API.get("/products");
  return res.data;
};

// CATEGORIES
export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};

// PROGRAMS
export const getPrograms = async () => {
  const res = await API.get("/programs");
  return res.data;
};

// SPECIALISTS (USER MODEL)
export const getSpecialists = async () => {
  const res = await API.get("/users/specialists");
  return res.data;
};
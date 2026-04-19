import API from "./api";


// ===============================
// GET ALL SUBCATEGORIES
// ===============================
const getAllSubCategories = () => {
  return API.get("/subcategories");
};


// ===============================
// GET SUBCATEGORIES BY CATEGORY
// ===============================
const getSubCategoriesByCategory = (categoryId) => {
  return API.get(`/subcategories/category/${categoryId}`);
};


// ===============================
// CREATE SUBCATEGORY
// ===============================
const createSubCategory = (formData) => {
  return API.post("/subcategories", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ===============================
// UPDATE SUBCATEGORY
// ===============================
const updateSubCategory = (id, formData) => {
  return API.put(`/subcategories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


// ===============================
// DELETE SUBCATEGORY
// ===============================
const deleteSubCategory = (id) => {
  return API.delete(`/subcategories/${id}`);
};


const subCategoryService = {
  getAllSubCategories,
  getSubCategoriesByCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
};

export default subCategoryService;
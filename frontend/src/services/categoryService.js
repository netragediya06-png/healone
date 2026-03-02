import axios from "axios";

const API_URL = "http://localhost:5000/api/categories";

// GET ALL CATEGORIES
const getAllCategories = async () => {
  return await axios.get(API_URL);
};

const categoryService = {
  getAllCategories,
};

export default categoryService;
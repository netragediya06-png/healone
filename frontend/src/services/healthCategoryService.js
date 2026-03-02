import axios from "axios";

const API_URL = "http://localhost:5000/api/health-categories";

// GET ALL HEALTH CATEGORIES
const getAllHealthCategories = async () => {
  return await axios.get(API_URL);
};

const healthCategoryService = {
  getAllHealthCategories,
};

export default healthCategoryService;
import axios from "axios";

const API = "http://localhost:5000/api/healthcategories";

const getAllHealthCategories = () =>
  axios.get(API);

export default {
  getAllHealthCategories
};
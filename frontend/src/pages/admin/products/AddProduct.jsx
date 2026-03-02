import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import "./HealOneProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    healthCategory: "",
    image: ""
  });

  // ==========================
  // FETCH PRODUCT CATEGORIES FROM DB
  // ==========================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ==========================
  // HANDLE IMAGE
  // ==========================
  const handleImage = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
  };

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await productService.createProduct(formData);
      navigate("/admin/products");
    } catch (error) {
      console.error("Create product error:", error);
    }
  };

  return (
    <div className="container py-4">
      <div className="healone-form-card p-4">

        <h3 className="fw-bold mb-4 healone-title">Add New Product</h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            {/* Name */}
            <div className="col-md-6">
              <label>Name</label>
              <input
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* PRODUCT CATEGORY FROM DB */}
            <div className="col-md-6">
              <label>Category</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="col-md-6">
              <label>Price</label>
              <input
                name="price"
                type="number"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Stock */}
            <div className="col-md-6">
              <label>Stock</label>
              <input
                name="stock"
                type="number"
                className="form-control"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="col-12">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* TEMPORARY HEALTH CATEGORY (STATIC) */}
            <div className="col-md-6">
              <label>Health Category</label>
              <select
                name="healthCategory"
                className="form-select"
                value={formData.healthCategory}
                onChange={handleChange}
                required
              >
                <option value="">Select Health Category</option>
                <option value="Stress">Stress</option>
                <option value="Immunity">Immunity</option>
                <option value="Digestion">Digestion</option>
                <option value="Skin Care">Skin Care</option>
                <option value="Hair Care">Hair Care</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Joint Pain">Joint Pain</option>
              </select>
            </div>

            {/* Image */}
            <div className="col-md-6">
              <label>Product Image</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImage}
                required
              />
            </div>

          </div>

          <button className="btn healone-btn mt-4">
            Save Product
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddProduct;
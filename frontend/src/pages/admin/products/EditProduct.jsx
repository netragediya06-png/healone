import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import "./HealOneProduct.css";

function EditProduct() {

  const { id } = useParams();
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

  const [preview, setPreview] = useState("");

  // ==========================
  // FETCH CATEGORIES
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
  // FETCH PRODUCT DATA
  // ==========================
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getSingleProduct(id);

        const product = res.data.product;

        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.category?._id || product.category,
          healthCategory: product.healthCategory,
          image: product.image
        });

        setPreview(product.image);

      } catch (error) {
        console.error("Fetch product error:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // ==========================
  // HANDLE CHANGE
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
      setPreview(reader.result);
    };
  };

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await productService.updateProduct(id, formData);
      navigate("/admin/products");
    } catch (error) {
      console.error("Update product error:", error);
    }
  };

  return (
    <div className="container py-4">

      <div className="healone-form-card p-4">

        <h3 className="fw-bold mb-4 healone-title">
          Edit Product
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-4">

            {/* LEFT SIDE FORM */}
            <div className="col-md-8">

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">Product Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* CATEGORY DROPDOWN */}
                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    className="form-select"
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

                <div className="col-md-6">
                  <label className="form-label">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    className="form-control"
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* TEMP HEALTH CATEGORY */}
                <div className="col-md-6">
                  <label className="form-label">Health Category</label>
                  <select
                    name="healthCategory"
                    value={formData.healthCategory}
                    className="form-select"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select</option>
                    <option value="Stress">Stress</option>
                    <option value="Immunity">Immunity</option>
                    <option value="Digestion">Digestion</option>
                    <option value="Skin Care">Skin Care</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Joint Pain">Joint Pain</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Change Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleImage}
                  />
                </div>

              </div>

            </div>

            {/* RIGHT SIDE IMAGE PREVIEW */}
            <div className="col-md-4 text-center">

              <div className="healone-image-preview-card p-3">

                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="img-fluid rounded"
                  />
                ) : (
                  <div className="healone-image-placeholder">
                    <i className="bi bi-image"></i>
                  </div>
                )}

                <p className="text-muted small mt-2">
                  Product Image Preview
                </p>

              </div>

            </div>

          </div>

          <button className="btn healone-btn mt-4">
            Update Product
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditProduct;
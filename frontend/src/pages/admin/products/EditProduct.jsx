import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import subCategoryService from "../../../services/subCategoryService";
import "./HealOneProduct.css";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subCategory: "",
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
        console.error("Category fetch error:", error);
      }
    };

    fetchCategories();

  }, []);

  // ==========================
  // FETCH PRODUCT
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
          subCategory: product.subCategory?._id || product.subCategory,
          image: product.image
        });

        setPreview(product.image);

        // load subcategories
        if (product.category?._id) {
          loadSubCategories(product.category._id);
        }

      } catch (error) {
        console.error("Fetch product error:", error);
      }

    };

    fetchProduct();

  }, [id]);

  // ==========================
  // LOAD SUBCATEGORIES
  // ==========================
  const loadSubCategories = async (categoryId) => {

    try {

      const res = await subCategoryService.getSubCategoriesByCategory(categoryId);

      setSubCategories(res.data);

    } catch (error) {

      console.error("Subcategory fetch error:", error);

    }

  };

  // ==========================
  // HANDLE CHANGE
  // ==========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // if category changes → reload subcategories
    if (name === "category") {

      setFormData((prev) => ({
        ...prev,
        category: value,
        subCategory: ""
      }));

      loadSubCategories(value);

    }

  };

  // ==========================
  // HANDLE IMAGE
  // ==========================
  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setFormData({
      ...formData,
      image: file
    });

    setPreview(URL.createObjectURL(file));

  };

  // ==========================
  // SUBMIT
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

            {/* LEFT SIDE */}
            <div className="col-md-8">

              <div className="row g-3">

                {/* NAME */}
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

                {/* CATEGORY */}
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

                {/* SUBCATEGORY */}
                <div className="col-md-6">
                  <label className="form-label">Sub Category</label>

                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    className="form-select"
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Sub Category</option>

                    {subCategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}

                  </select>
                </div>

                {/* PRICE */}
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

                {/* STOCK */}
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

                {/* DESCRIPTION */}
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

                {/* IMAGE */}
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

            {/* IMAGE PREVIEW */}
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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../../services/productService";
import axios from "axios";
import "./HealOneProduct.css";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

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

  // Fetch Product
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        setFormData(res.data.product);
        setPreview(res.data.product.image);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
      setPreview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await productService.updateProduct(id, formData);
    navigate("/admin/products");
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

                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input
                    name="category"
                    value={formData.category}
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
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
                    <option value="Skin">Skin</option>
                    <option value="Hair">Hair</option>
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

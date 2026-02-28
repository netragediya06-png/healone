import { useState } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../../services/productService";
import "./HealOneProduct.css";

function AddProduct() {

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await productService.createProduct(formData);
    navigate("/admin/products");
  };

  return (
    <div className="container py-4">

      <div className="healone-form-card p-4">

        <h3 className="fw-bold mb-4 healone-title">Add New Product</h3>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-md-6">
              <label>Name</label>
              <input name="name" className="form-control" onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label>Category</label>
              <input name="category" className="form-control" onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label>Price</label>
              <input name="price" type="number" className="form-control" onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label>Stock</label>
              <input name="stock" type="number" className="form-control" onChange={handleChange} />
            </div>

            <div className="col-12">
              <label>Description</label>
              <textarea name="description" className="form-control" rows="3" onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label>Health Category</label>
              <select name="healthCategory" className="form-select" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Stress">Stress</option>
                <option value="Immunity">Immunity</option>
                <option value="Digestion">Digestion</option>
                <option value="Skin">Skin</option>
                <option value="Hair">Hair</option>
              </select>
            </div>

            <div className="col-md-6">
              <label>Product Image</label>
              <input type="file" className="form-control" onChange={handleImage} required />
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

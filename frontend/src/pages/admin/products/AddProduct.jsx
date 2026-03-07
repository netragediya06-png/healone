import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import subCategoryService from "../../../services/subCategoryService";
import "./HealOneProduct.css";

function AddProduct() {

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
  // FETCH SUBCATEGORIES
  // ==========================
  const fetchSubCategories = async (categoryId) => {

    try {

      const res = await subCategoryService.getSubCategoriesByCategory(categoryId);
      setSubCategories(res.data);

    } catch (error) {

      console.error("SubCategory fetch error:", error);

    }

  };

  // ==========================
  // HANDLE INPUT CHANGE
  // ==========================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // when category changes load subcategories
    if (name === "category") {

      fetchSubCategories(value);

      setFormData(prev => ({
        ...prev,
        category: value,
        subCategory: ""
      }));

    }

  };

  // ==========================
  // HANDLE IMAGE
  // ==========================
const handleImage = (e) => {
  setFormData({
    ...formData,
    image: e.target.files[0]
  });
};

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("category", formData.category);
    data.append("subCategory", formData.subCategory);
    data.append("image", formData.image);

    await productService.createProduct(data);


    

      navigate("/admin/products");

    } catch (error) {

      console.error("Create product error:", error);

    }

  };

  return (

    <div className="container py-4">

      <div className="healone-form-card p-4">

        <h3 className="fw-bold mb-4 healone-title">
          Add New Product
        </h3>

        <form onSubmit={handleSubmit}>

          <div className="row g-3">

            {/* PRODUCT NAME */}
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


            {/* CATEGORY */}
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


            {/* SUBCATEGORY */}
            <div className="col-md-6">

              <label>SubCategory</label>

              <select
                name="subCategory"
                className="form-select"
                value={formData.subCategory}
                onChange={handleChange}
                required
              >

                <option value="">Select SubCategory</option>

                {subCategories.map((sub) => (

                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>

                ))}

              </select>

            </div>


            {/* PRICE */}
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


            {/* STOCK */}
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


            {/* DESCRIPTION */}
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


            {/* IMAGE */}
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
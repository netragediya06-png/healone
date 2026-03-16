import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import subCategoryService from "../../../services/subCategoryService";

function AddProduct() {

  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    subCategory: "",
    image: null
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

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

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

    const file = e.target.files[0];

    if (!file) return;

    setFormData(prev => ({
      ...prev,
      image: file
    }));

    setPreview(URL.createObjectURL(file));

  };

  // ==========================
  // HANDLE SUBMIT
  // ==========================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (
        !formData.name ||
        !formData.description ||
        !formData.price ||
        !formData.category ||
        !formData.subCategory
      ) {
        alert("Please fill all required fields");
        return;
      }

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", Number(formData.price));
      data.append("stock", Number(formData.stock) || 0);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await productService.createProduct(data);

      navigate("/admin/products");

    } catch (error) {

      console.error("Create product error:", error);

      alert("Failed to create product");

    }

  };

  return (

    <div className="p-6">

      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* PRODUCT NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>


          {/* CATEGORY */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              SubCategory
            </label>

            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>

            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />

          </div>


          {/* STOCK */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>

            <input
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />

          </div>


          {/* IMAGE */}
          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>

            <input
              type="file"
              onChange={handleImage}
              required
              className="w-full border rounded-lg px-3 py-2"
            />

          </div>


          {/* IMAGE PREVIEW */}
          {preview && (
            <div className="md:col-span-2">

              <img
                src={preview}
                alt="preview"
                className="h-40 rounded-lg object-cover"
              />

            </div>
          )}


          {/* DESCRIPTION */}
          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>

            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />

          </div>


          {/* BUTTON */}
          <div className="md:col-span-2">

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save Product
            </button>

          </div>

        </form>

      </div>

    </div>

  );

}

export default AddProduct;
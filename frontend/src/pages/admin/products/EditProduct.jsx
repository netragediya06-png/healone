import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "../../../services/productService";
import categoryService from "../../../services/categoryService";
import subCategoryService from "../../../services/subCategoryService";

function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",   // ✅ NEW
    badge: "",           // ✅ NEW
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
          originalPrice: product.originalPrice || "", // ✅ NEW
          badge: product.badge || "",                 // ✅ NEW
          stock: product.stock,
          category: product.category?._id || product.category,
          subCategory: product.subCategory?._id || product.subCategory,
          image: product.image
        });

        setPreview(product.image);

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

      const data = new FormData();

      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", Number(formData.price));

      // ✅ NEW
      data.append(
        "originalPrice",
        Number(formData.originalPrice) || Number(formData.price)
      );
      data.append("badge", formData.badge);

      data.append("stock", Number(formData.stock) || 0);
      data.append("category", formData.category);
      data.append("subCategory", formData.subCategory);

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      await productService.updateProduct(id, data);

      navigate("/admin/products");

    } catch (error) {

      console.error("Update product error:", error);

    }

  };

  // ✅ LIVE DISCOUNT PREVIEW
  const discount =
    formData.originalPrice && formData.originalPrice > formData.price
      ? Math.round(
          ((formData.originalPrice - formData.price) / formData.originalPrice) * 100
        )
      : 0;

  return (

    <div className="p-6">

      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT FORM */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
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
                  Sub Category
                </label>

                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
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

              {/* ✅ ORIGINAL PRICE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price
                </label>

                <input
                  name="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                />

                {discount > 0 && (
                  <p className="text-green-600 text-sm mt-1">
                    Discount: {discount}%
                  </p>
                )}
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

              {/* ✅ BADGE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Tag
                </label>

                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="">No Tag</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Popular">Popular</option>
                  <option value="Top Rated">Top Rated</option>
                  <option value="Best Value">Best Value</option>
                  <option value="New">New</option>
                </select>
              </div>

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

              {/* IMAGE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Change Image
                </label>

                <input
                  type="file"
                  onChange={handleImage}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

            </div>

            {/* IMAGE PREVIEW */}
            <div className="flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-xl p-4 flex flex-col items-center">

                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
                    className="rounded-lg object-cover w-full h-64"
                  />
                ) : (
                  <div className="h-64 w-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}

                <p className="text-sm text-gray-500 mt-3">
                  Product Image Preview
                </p>

              </div>
            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Update Product
          </button>

        </form>

      </div>

    </div>

  );

}

export default EditProduct;
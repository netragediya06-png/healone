import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    status: true,
  });

  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategoriesWithSubCount();
      setCategories(res.data);
    } catch (error) {
      console.error("Fetch Categories Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("status", formData.status);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {
        await categoryService.updateCategory(editId, data);
      } else {
        await categoryService.createCategory(data);
      }

      fetchCategories();
      closeModal();

    } catch (error) {
      console.error("Save Category Error:", error);
    }
  };

  const handleEdit = (cat) => {

    setEditId(cat._id);

    setFormData({
      name: cat.name,
      description: cat.description,
      image: null,
      status: cat.status,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this category?")) return;

    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const closeModal = () => {

    setEditId(null);

    setFormData({
      name: "",
      description: "",
      image: null,
      status: true,
    });

    setShowModal(false);
  };

  const filteredCategories = (categories || []).filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            HealOne Categories
          </h2>

          <p className="text-gray-500 text-sm">
            Manage product categories
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Add Category
        </button>

      </div>

      {/* SEARCH */}

      <input
        type="text"
        placeholder="Search categories..."
        className="w-full mb-6 p-3 border rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* CATEGORY GRID */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {filteredCategories.map((cat) => (

          <div
            key={cat._id}
            className="bg-white rounded-xl shadow p-6 text-center"
          >

            {/* IMAGE */}

            {cat.image ? (
              <img
                src={cat.image}
                alt="category"
                className="w-20 h-20 mx-auto rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-20 h-20 mx-auto rounded-full bg-gray-200 flex items-center justify-center mb-3">
                🖼
              </div>
            )}

            <h5 className="font-semibold text-lg">{cat.name}</h5>

            <p className="text-gray-500 text-sm">
              {cat.description}
            </p>

            <p className="text-blue-600 text-sm font-medium">
              {cat.subCategoryCount || 0} SubCategories
            </p>

            <span
              className={`inline-block px-3 py-1 text-xs rounded-full mt-2 ${
                cat.status
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {cat.status ? "Active" : "Inactive"}
            </span>

            <div className="flex justify-center gap-2 mt-4">

              <button
                onClick={() => handleEdit(cat)}
                className="border border-blue-500 text-blue-500 px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(cat._id)}
                className="border border-red-500 text-red-500 px-3 py-1 rounded"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">

            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit Category" : "Add Category"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Category Name"
                className="w-full p-2 border rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <input
                type="file"
                className="w-full"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
              />

              <select
                className="w-full p-2 border rounded"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value === "true",
                  })
                }
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editId ? "Update" : "Save"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Categories;
import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";
import subCategoryService from "../../services/subCategoryService";

function SubCategories() {

  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    image: null,
    status: true
  });

  const [editId, setEditId] = useState(null);


  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);


  // ===============================
  // FETCH SUBCATEGORIES
  // ===============================

  const fetchSubCategories = async () => {

    try {

      const res = await subCategoryService.getAllSubCategories();
      setSubCategories(res.data);

    } catch (error) {

      console.error("SubCategory fetch error:", error);

    }

  };


  // ===============================
  // FETCH CATEGORIES
  // ===============================

  const fetchCategories = async () => {

    try {

      const res = await categoryService.getAllCategories();
      setCategories(res.data);

    } catch (error) {

      console.error("Category fetch error:", error);

    }

  };


  // ===============================
  // FILTER + SEARCH
  // ===============================

  const filteredSubCategories = subCategories.filter((sub) => {

    if (statusFilter !== "All") {

      if (sub.status !== (statusFilter === "Active")) {
        return false;
      }

    }

    if (search) {

      return sub.name
        .toLowerCase()
        .includes(search.toLowerCase());

    }

    return true;

  });


  // ===============================
  // SUBMIT
  // ===============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("status", formData.status);

      if (formData.image) {
        data.append("image", formData.image);
      }

      if (editId) {

        await subCategoryService.updateSubCategory(editId, data);

      } else {

        await subCategoryService.createSubCategory(data);

      }

      fetchSubCategories();
      closeModal();

    } catch (error) {

      console.error("Save error:", error);

    }

  };


  // ===============================
  // EDIT
  // ===============================

  const handleEdit = (sub) => {

    setEditId(sub._id);

    setFormData({
      name: sub.name,
      category: sub.category._id,
      image: null,
      status: sub.status
    });

    setShowModal(true);

  };


  // ===============================
  // DELETE
  // ===============================

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this subcategory?")) return;

    try {

      await subCategoryService.deleteSubCategory(id);
      fetchSubCategories();

    } catch (error) {

      console.error("Delete error:", error);

    }

  };


  // ===============================
  // CLOSE MODAL
  // ===============================

  const closeModal = () => {

    setEditId(null);

    setFormData({
      name: "",
      category: "",
      image: null,
      status: true
    });

    setShowModal(false);

  };


  // ===============================
  // STATS
  // ===============================

  const stats = {

    total: subCategories.length,
    active: subCategories.filter((s) => s.status).length,
    inactive: subCategories.filter((s) => !s.status).length

  };


  return (

    <div className="p-6 space-y-6">


      {/* HEADER */}

      <div>

        <h2 className="text-2xl font-bold text-gray-800">
          SubCategory Management
        </h2>

        <p className="text-sm text-gray-500">
          Manage product subcategories
        </p>

      </div>


      {/* TOP FILTER CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {[
          { label: "Total", value: stats.total, key: "All", color: "bg-gray-100" },
          { label: "Active", value: stats.active, key: "Active", color: "bg-green-100" },
          { label: "Inactive", value: stats.inactive, key: "Inactive", color: "bg-red-100" },
        ].map((card) => (

          <div
            key={card.key}
            onClick={() => setStatusFilter(card.key)}
            className={`p-4 rounded-lg cursor-pointer text-center
            ${card.color}
            ${statusFilter === card.key ? "ring-2 ring-green-500" : ""}
            `}
          >

            <h4 className="text-xl font-bold">
              {card.value}
            </h4>

            <span className="text-sm text-gray-600">
              {card.label}
            </span>

          </div>

        ))}

      </div>


      {/* SEARCH + ADD */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <input
          type="text"
          placeholder="Search subcategories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={() => {
            closeModal();
            setShowModal(true);
          }}
          className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition shadow-sm hover:shadow-md"
        >
          + Add SubCategory
        </button>

      </div>


      {/* SUBCATEGORY GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredSubCategories.map((sub) => (

          <div
            key={sub._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-6 text-center"
          >

            {sub.image ? (

              <img
                src={sub.image}
                alt="subcategory"
                className="w-20 h-20 mx-auto rounded-full object-cover mb-3"
              />

            ) : (

              <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                📷
              </div>

            )}

            <h5 className="font-semibold text-lg">
              {sub.name}
            </h5>

            <p className="text-gray-500 text-sm">
              Category: {sub.category?.name}
            </p>

            <span
              className={`inline-block px-3 py-1 text-xs rounded-full mt-2
              ${sub.status
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"}
              `}
            >
              {sub.status ? "Active" : "Inactive"}
            </span>


            {/* BUTTONS */}

            <div className="flex justify-center gap-3 mt-4">

              <button
                onClick={() => handleEdit(sub)}
                className="px-4 py-1.5 text-xs font-medium rounded-md
                border border-blue-500 text-blue-600
                hover:bg-blue-500 hover:text-white
                transition-all duration-200"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(sub._id)}
                className="px-4 py-1.5 text-xs font-medium rounded-md
                border border-red-500 text-red-600
                hover:bg-red-500 hover:text-white
                transition-all duration-200"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>


      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">

            <h3 className="text-lg font-semibold mb-4">
              {editId ? "Edit SubCategory" : "Add SubCategory"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="SubCategory Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full border rounded-lg px-3 py-2"
              />

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="w-full border rounded-lg px-3 py-2"
              >

                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}

              </select>

              <input
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.files[0] })
                }
                className="w-full border rounded-lg px-3 py-2"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value === "true"
                  })
                }
                className="w-full border rounded-lg px-3 py-2"
              >

                <option value="true">Active</option>
                <option value="false">Inactive</option>

              </select>

              <div className="flex justify-end gap-2">

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

export default SubCategories;
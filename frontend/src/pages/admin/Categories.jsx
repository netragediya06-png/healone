import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";

function Categories() {

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

      console.error(error);

    }

  };

  // ============================
  // FILTER + SEARCH
  // ============================

  useEffect(() => {

    let data = [...categories];

    if (statusFilter !== "All") {
      data = data.filter((c) => c.status === (statusFilter === "Active"));
    }

    if (search) {
      data = data.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCategories(data);

  }, [categories, search, statusFilter]);


  // ============================
  // SAVE CATEGORY
  // ============================

  const handleSubmit = async (e) => {

    e.preventDefault();

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

    await categoryService.deleteCategory(id);

    fetchCategories();

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


  // ============================
  // STATS
  // ============================

  const stats = {

    total: categories.length,
    active: categories.filter((c) => c.status === true).length,
    inactive: categories.filter((c) => c.status === false).length

  };


  return (

    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h2 className="text-2xl font-bold text-gray-800">
            Category Management
          </h2>

          <p className="text-sm text-gray-500">
            Manage your store categories
          </p>

        </div>

        {/* <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Category
        </button> */}

      </div>


      {/* TOP CARDS */}

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


      {/* SEARCH */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        {/* Search Bar */}

        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-green-500"
        />

        {/* Add Category Button */}

        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-5 py-2 rounded-lg
               hover:bg-emerald-700 transition shadow-sm hover:shadow-md"
        >
          + Add Category
        </button>

      </div>


      {/* CATEGORY GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredCategories.map((cat) => (

          <div
            key={cat._id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl
            hover:-translate-y-2 transition-all duration-300
            p-6 text-center"
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

            <h5 className="font-semibold text-lg">
              {cat.name}
            </h5>

            <p className="text-gray-500 text-sm mb-2">
              {cat.description}
            </p>

            <p className="text-blue-600 text-sm font-medium">
              {cat.subCategoryCount || 0} SubCategories
            </p>


            {/* STATUS */}

            <span
              className={`inline-block px-3 py-1 text-xs rounded-full mt-2
              ${cat.status
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"}
              `}
            >
              {cat.status ? "Active" : "Inactive"}
            </span>


            {/* BUTTONS */}

            <div className="flex justify-center gap-3 mt-4">

              {/* Edit Button */}

              <button
                onClick={() => handleEdit(cat)}
                className="px-4 py-1.5 text-xs font-medium rounded-md
               border border-blue-500 text-blue-600
               hover:bg-blue-500 hover:text-white
               transition-all duration-200"
              >
                Edit
              </button>

              {/* Delete Button */}

              <button
                onClick={() => handleDelete(cat._id)}
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
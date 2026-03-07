import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import categoryService from "../../services/categoryService";
import subCategoryService from "../../services/subCategoryService";
import "./HealOne.css";

function SubCategories() {

  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

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
  // HANDLE SUBMIT
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

    const modal = new Modal(document.getElementById("subCategoryModal"));
    modal.show();

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

    const modalElement = document.getElementById("subCategoryModal");

    const modalInstance = Modal.getInstance(modalElement);

    if (modalInstance) modalInstance.hide();

  };

  // ===============================
  // SEARCH FILTER
  // ===============================
  const filteredSubCategories = subCategories.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-0 healone-title">
            HealOne SubCategories
          </h2>

          <small className="text-muted">
            Manage product subcategories
          </small>
        </div>

        <button
          className="btn healone-btn px-4"
          data-bs-toggle="modal"
          data-bs-target="#subCategoryModal"
          onClick={() => closeModal()}
        >
          Add SubCategory
        </button>

      </div>

      {/* SEARCH */}
      <div className="mb-4">

        <input
          type="text"
          className="form-control healone-search"
          placeholder="Search subcategories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* CARDS */}
      <div className="row g-4">

        {filteredSubCategories.map((sub) => (

          <div className="col-md-4" key={sub._id}>

            <div className="card healone-card h-100 text-center">

              <div className="card-body">

                {sub.image ? (
                  <img
                    src={sub.image}
                    alt="subcategory"
                    className="rounded-circle mb-3 healone-img"
                  />
                ) : (
                  <div className="healone-placeholder mb-3">
                    <i className="bi bi-image"></i>
                  </div>
                )}

                <h5 className="fw-semibold">{sub.name}</h5>

                <p className="text-muted small">
                  Category: {sub.category?.name}
                </p>

                <span className={`badge mb-3 ${sub.status ? "bg-success" : "bg-danger"}`}>
                  {sub.status ? "Active" : "Inactive"}
                </span>

                <div className="d-flex justify-content-center gap-2">

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEdit(sub)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(sub._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}
      <div className="modal fade" id="subCategoryModal" tabIndex="-1">

        <div className="modal-dialog">

          <div className="modal-content healone-modal">

            <div className="modal-header">

              <h5 className="modal-title">
                {editId ? "Edit SubCategory" : "Add SubCategory"}
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="modal-body">

                <div className="mb-3">

                  <label className="form-label">SubCategory Name</label>

                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">Category</label>

                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
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

                <div className="mb-3">

                  <label className="form-label">Upload Image</label>

                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label">Status</label>

                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value === "true"
                      })
                    }
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>

                </div>

              </div>

              <div className="modal-footer">

                <button className="btn healone-btn">
                  {editId ? "Update" : "Save"}
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>

  );

}

export default SubCategories;
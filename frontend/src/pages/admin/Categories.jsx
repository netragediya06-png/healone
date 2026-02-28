import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import "./HealOne.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
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

  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("status", formData.status);
    if (formData.image) {
      data.append("image", formData.image);
    }

    const request = editId
      ? axios.put(`http://localhost:5000/api/categories/${editId}`, data)
      : axios.post("http://localhost:5000/api/categories", data);

    request
      .then(() => {
        fetchCategories();
        closeModal();
      })
      .catch((err) => console.error(err));
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description,
      image: null,
      status: cat.status,
    });

    const modal = new Modal(document.getElementById("categoryModal"));
    modal.show();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      axios
        .delete(`http://localhost:5000/api/categories/${id}`)
        .then(() => fetchCategories())
        .catch((err) => console.error(err));
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

    const modalElement = document.getElementById("categoryModal");
    const modalInstance = Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-0 healone-title">HealOne Categories</h2>
          <small className="text-muted">
            Manage product categories
          </small>
        </div>

        <button
          className="btn healone-btn px-4"
          data-bs-toggle="modal"
          data-bs-target="#categoryModal"
          onClick={() => closeModal()}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Category
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control healone-search"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CATEGORY CARDS */}
      <div className="row g-4">
        {filteredCategories.map((cat) => (
          <div className="col-md-4" key={cat._id}>
            <div className="card healone-card h-100 text-center">
              <div className="card-body">

                {cat.image ? (
                  <img
                    src={cat.image}
                    alt="category"
                    className="rounded-circle mb-3 healone-img"
                  />
                ) : (
                  <div className="healone-placeholder mb-3">
                    <i className="bi bi-image"></i>
                  </div>
                )}

                <h5 className="fw-semibold">{cat.name}</h5>
                <p className="text-muted small">
                  {cat.description}
                </p>

                <span className={`badge mb-3 ${cat.status ? "bg-success" : "bg-danger"}`}>
                  {cat.status ? "Active" : "Inactive"}
                </span>

                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEdit(cat)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(cat._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <div className="modal fade" id="categoryModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content healone-modal">
            <div className="modal-header">
              <h5 className="modal-title">
                {editId ? "Edit Category" : "Add Category"}
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
                  <label className="form-label">Category Name</label>
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
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
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
                        status: e.target.value === "true",
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

export default Categories;

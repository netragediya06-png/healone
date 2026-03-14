import { useState, useEffect } from "react";

const initialYoga =
  JSON.parse(localStorage.getItem("myYogaServices")) || [];

function MyYogaServices() {

  const [services, setServices] = useState(initialYoga);
  const [editId, setEditId] = useState(null);
  const [viewService, setViewService] = useState(null);

  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    price: "",
    mode: "online",
    location: "",
    availableSlots: ""
  });

  /* Sync LocalStorage */
  useEffect(() => {
    localStorage.setItem("myYogaServices", JSON.stringify(services));
  }, [services]);

  /* Input Change */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Reset Form */
  const resetForm = () => {
    setEditId(null);
    setFormData({
      title: "",
      description: "",
      duration: "",
      price: "",
      mode: "online",
      location: "",
      availableSlots: ""
    });
  };

  /* Add / Update */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {

      const updated = services.map((s) =>
        s._id === editId ? { ...s, ...formData } : s
      );

      setServices(updated);

    } else {

      const newService = {
        ...formData,
        _id: Date.now(),
        status: "Pending"
      };

      setServices([...services, newService]);

    }

    resetForm();

    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("yogaModal")
    );

    modal.hide();
  };

  /* Edit */
  const handleEdit = (service) => {

    setEditId(service._id);

    setFormData({
      title: service.title,
      description: service.description,
      duration: service.duration,
      price: service.price,
      mode: service.mode,
      location: service.location,
      availableSlots: service.availableSlots
    });

    const modal = new window.bootstrap.Modal(
      document.getElementById("yogaModal")
    );

    modal.show();
  };

  /* Delete */
  const handleDelete = (id) => {

    if (!window.confirm("Delete this yoga service?")) return;

    setServices(services.filter((s) => s._id !== id));
  };

  /* View */
  const handleView = (service) => {

    setViewService(service);

    const modal = new window.bootstrap.Modal(
      document.getElementById("viewModal")
    );

    modal.show();
  };

  /* Search + Filter */
  const filteredServices = services.filter((s) => {

    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase());

    const matchMode = modeFilter
      ? s.mode === modeFilter
      : true;

    return matchSearch && matchMode;
  });

  return (
    <div className="container-fluid mt-4">

      {/* HEADER */}

      <div className="d-flex justify-content-between mb-3">

        <h2>My Yoga Services</h2>

        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#yogaModal"
          onClick={resetForm}
        >
          + Add Yoga Service
        </button>

      </div>

      {/* SEARCH + FILTER */}

      <div className="row mb-4">

        <div className="col-md-6">

          <input
            type="text"
            placeholder="Search Yoga Service..."
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="col-md-3">

          <select
            className="form-control"
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
          >

            <option value="">All Modes</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="both">Both</option>

          </select>

        </div>

      </div>

      {/* CARDS */}

      <div className="row">

        {filteredServices.map((service) => (

          <div className="col-md-4 mb-4" key={service._id}>

            <div className="card shadow border-0 h-100">

              <div className="card-body">

                <h5>{service.title}</h5>

                <p className="text-muted">
                  Mode: {service.mode}
                </p>

                <p>
                  Duration: {service.duration} Minutes
                </p>

                <p>
                  Price: ₹{service.price}
                </p>

                <span
                  className={`badge ${
                    service.status === "Approved"
                      ? "bg-success"
                      : service.status === "Rejected"
                      ? "bg-danger"
                      : "bg-warning"
                  }`}
                >
                  {service.status}
                </span>

              </div>

              {/* BUTTONS */}

              <div className="card-footer d-flex justify-content-between">

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleView(service)}
                >
                  View
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEdit(service)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(service._id)}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* VIEW MODAL */}

      <div className="modal fade" id="viewModal">

        <div className="modal-dialog modal-lg">

          <div className="modal-content">

            <div className="modal-header">

              <h5>Yoga Service Details</h5>

              <button
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>

            </div>

            <div className="modal-body">

              {viewService && (

                <>
                  <h4>{viewService.title}</h4>

                  <p>
                    <b>Description:</b> {viewService.description}
                  </p>

                  <p>
                    <b>Mode:</b> {viewService.mode}
                  </p>

                  <p>
                    <b>Duration:</b>{" "}
                    {viewService.duration} minutes
                  </p>

                  <p>
                    <b>Price:</b> ₹{viewService.price}
                  </p>

                  <p>
                    <b>Location:</b> {viewService.location}
                  </p>

                  <p>
                    <b>Available Slots:</b>{" "}
                    {viewService.availableSlots}
                  </p>

                </>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* ADD / EDIT MODAL */}

      <div className="modal fade" id="yogaModal">

        <div className="modal-dialog modal-lg">

          <div className="modal-content">

            <div className="modal-header">

              <h5>
                {editId ? "Edit Yoga Service" : "Add Yoga Service"}
              </h5>

              <button
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>

            </div>

            <div className="modal-body">

              <form>

                <input
                  className="form-control mb-3"
                  name="title"
                  placeholder="Yoga Title"
                  value={formData.title}
                  onChange={handleChange}
                />

                <textarea
                  className="form-control mb-3"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-3"
                  name="duration"
                  placeholder="Duration (minutes)"
                  value={formData.duration}
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-3"
                  name="price"
                  placeholder="Price"
                  value={formData.price}
                  onChange={handleChange}
                />

                <select
                  className="form-control mb-3"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                >

                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="both">Both</option>

                </select>

                <input
                  className="form-control mb-3"
                  name="location"
                  placeholder="Location (if offline)"
                  value={formData.location}
                  onChange={handleChange}
                />

                <input
                  className="form-control mb-3"
                  name="availableSlots"
                  placeholder="Available Slots"
                  value={formData.availableSlots}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={handleSubmit}
                >

                  {editId
                    ? "Update Yoga Service"
                    : "Add Yoga Service"}

                </button>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default MyYogaServices;
import { useState, useEffect } from "react";

const initialRemedies = JSON.parse(localStorage.getItem("myRemedies")) || [];

function MyRemedies() {
  const [remedies, setRemedies] = useState(initialRemedies);
  const [editId, setEditId] = useState(null);
  const [preview, setPreview] = useState("");
  const [viewRemedy, setViewRemedy] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    symptoms: [""],
    ingredients: [""],
    steps: [""],
    benefits: "",
    precautions: "",
    healthCategory: "",
    image: null
  });

  /* Sync with localStorage */
  useEffect(() => {
    localStorage.setItem("myRemedies", JSON.stringify(remedies));
  }, [remedies]);

  /* INPUT CHANGE */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* IMAGE CHANGE */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setFormData({ ...formData, image: file });
  };

  /* ARRAY CHANGE */
  const handleArrayChange = (index, field, value) => {
    const data = [...formData[field]];
    data[index] = value;
    setFormData({ ...formData, [field]: data });
  };

  /* ADD FIELD */
  const addField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  /* REMOVE FIELD */
  const removeField = (index, field) => {
    const data = [...formData[field]];
    data.splice(index, 1);
    setFormData({ ...formData, [field]: data });
  };

  /* EDIT REMEDY */
  const handleEdit = (remedy) => {
    setEditId(remedy._id);

    setFormData({
      title: remedy.title || "",
      symptoms: remedy.symptoms || [""],
      ingredients: remedy.ingredients || [""],
      steps: remedy.steps || [""],
      benefits: remedy.benefits || "",
      precautions: remedy.precautions || "",
      healthCategory: remedy.healthCategory || "",
      image: null
    });

    setPreview(remedy.image || "");

    const modal = new window.bootstrap.Modal(
      document.getElementById("remedyModal")
    );
    modal.show();
  };

  /* VIEW REMEDY */
  const handleView = (remedy) => {
    setViewRemedy(remedy);

    const modal = new window.bootstrap.Modal(
      document.getElementById("viewModal")
    );
    modal.show();
  };

  /* ADD / UPDATE */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      const updated = remedies.map((r) =>
        r._id === editId ? { ...r, ...formData, image: preview } : r
      );
      setRemedies(updated);
    } else {
      const newRemedy = {
        ...formData,
        _id: Date.now(),
        image: preview
      };
      setRemedies([...remedies, newRemedy]);
    }

    setEditId(null);

    setFormData({
      title: "",
      symptoms: [""],
      ingredients: [""],
      steps: [""],
      benefits: "",
      precautions: "",
      healthCategory: "",
      image: null
    });

    setPreview("");

    const modal = window.bootstrap.Modal.getInstance(
      document.getElementById("remedyModal")
    );
    modal.hide();
  };

  /* DELETE */
  const handleDelete = (id) => {
    if (!window.confirm("Delete this remedy?")) return;
    setRemedies(remedies.filter((r) => r._id !== id));
  };

  return (
    <div className="container-fluid mt-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between mb-4">
        <h2>My Remedies</h2>

        <button
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#remedyModal"
          onClick={() => {
            setEditId(null);
            setFormData({
              title: "",
              symptoms: [""],
              ingredients: [""],
              steps: [""],
              benefits: "",
              precautions: "",
              healthCategory: "",
              image: null
            });
            setPreview("");
          }}
        >
          + Add Remedy
        </button>

        <span className="badge bg-success p-3">
            {remedies.length} Total Remedies
          </span>
      </div>

      {/* CARDS */}
      <div className="row">
        {remedies.map((remedy) => (
          <div className="col-md-4 mb-4" key={remedy._id}>
            <div className="card shadow border-0 h-100">
              {remedy.image && (
                <img
                  src={remedy.image}
                  className="card-img-top"
                  style={{ height: "180px", objectFit: "cover" }}
                  alt={remedy.title}
                />
              )}

              <div className="card-body">
                <h5>{remedy.title}</h5>
                <p className="text-muted">
                  Category: {remedy.healthCategory}
                </p>
              </div>

              {/* 3 BUTTONS */}
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleView(remedy)}
                >
                  View
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleEdit(remedy)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(remedy._id)}
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
              <h5>Remedy Details</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {viewRemedy && (
                <>
                  {viewRemedy.image && (
                    <img
                      src={viewRemedy.image}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover"
                      }}
                      className="mb-3"
                    />
                  )}

                  <h4>{viewRemedy.title}</h4>

                  <p><b>Category:</b> {viewRemedy.healthCategory}</p>
                  <p><b>Benefits:</b> {viewRemedy.benefits}</p>
                  <p><b>Precautions:</b> {viewRemedy.precautions}</p>

                  <h6>Symptoms</h6>
                  <ul>
                    {viewRemedy.symptoms.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>

                  <h6>Ingredients</h6>
                  <ul>
                    {viewRemedy.ingredients.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>

                  <h6>Steps</h6>
                  <ul>
                    {viewRemedy.steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <div className="modal fade" id="remedyModal">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5>{editId ? "Edit Remedy" : "Add Remedy"}</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <form>
                <input
                  className="form-control mb-3"
                  name="title"
                  placeholder="Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

                <input
                  className="form-control mb-3"
                  name="healthCategory"
                  placeholder="Category"
                  value={formData.healthCategory}
                  onChange={handleChange}
                />

                <textarea
                  className="form-control mb-3"
                  name="benefits"
                  placeholder="Benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                />

                <textarea
                  className="form-control mb-3"
                  name="precautions"
                  placeholder="Precautions"
                  value={formData.precautions}
                  onChange={handleChange}
                />

                <label>Upload Image</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  onChange={handleImageChange}
                />

                {preview && (
                  <img
                    src={preview}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      marginBottom: "15px"
                    }}
                  />
                )}

                {/* Symptoms */}
                <h6>Symptoms</h6>
                {formData.symptoms.map((item, index) => (
                  <div className="input-group mb-2" key={index}>
                    <input
                      className="form-control"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(index, "symptoms", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeField(index, "symptoms")}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mb-3"
                  onClick={() => addField("symptoms")}
                >
                  + Add Symptom
                </button>

                {/* Ingredients */}
                <h6>Ingredients</h6>
                {formData.ingredients.map((item, index) => (
                  <div className="input-group mb-2" key={index}>
                    <input
                      className="form-control"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(index, "ingredients", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeField(index, "ingredients")}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mb-3"
                  onClick={() => addField("ingredients")}
                >
                  + Add Ingredient
                </button>

                {/* Steps */}
                <h6>Steps</h6>
                {formData.steps.map((item, index) => (
                  <div className="input-group mb-2" key={index}>
                    <input
                      className="form-control"
                      value={item}
                      onChange={(e) =>
                        handleArrayChange(index, "steps", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeField(index, "steps")}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mb-3"
                  onClick={() => addField("steps")}
                >
                  + Add Step
                </button>

                <button
                  type="button"
                  className="btn btn-success w-100 mt-3"
                  onClick={handleSubmit}
                >
                  {editId ? "Update Remedy" : "Add Remedy"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyRemedies;
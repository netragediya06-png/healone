import { useState, useEffect } from "react";
import { createYoga } from "../../../services/yogaService";
import API from "../../../services/api";

function AddYoga() {

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    duration: "",
    caloriesBurn: "",
    videoUrl: "",
    benefits: [""],
    steps: [""],
    cautions: [""],
    tags: [""],
    image: null
  });

  /* ===============================
     LOAD CATEGORIES
  =============================== */

  useEffect(() => {

    const fetchCategories = async () => {
      try {

        const res = await API.get("/categories");
        setCategories(res.data);

      } catch (error) {
        console.log("Category load error", error);
      }
    };

    fetchCategories();

  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleArrayChange = (index, field, value) => {

    const updated = [...form[field]];
    updated[index] = value;

    setForm({
      ...form,
      [field]: updated
    });

  };

  const addField = (field) => {

    setForm({
      ...form,
      [field]: [...form[field], ""]
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createYoga(form);

      alert("Yoga submitted successfully! Waiting for admin approval.");

      setForm({
        title: "",
        subtitle: "",
        description: "",
        category: "",
        difficulty: "Beginner",
        duration: "",
        caloriesBurn: "",
        videoUrl: "",
        benefits: [""],
        steps: [""],
        cautions: [""],
        tags: [""],
        image: null
      });

    } catch (error) {

      alert(error.response?.data?.message || "Error adding yoga");

    }

  };

  return (

    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">

      <h2 className="text-2xl font-bold mb-6">Add New Yoga</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Yoga Title"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          value={form.title}
          required
        />

        {/* Subtitle */}
        <input
          type="text"
          name="subtitle"
          placeholder="Subtitle (Pose name)"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          value={form.subtitle}
        />

        {/* Description */}
        <textarea
          name="description"
          placeholder="Yoga Description"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          value={form.description}
          required
        />

        {/* CATEGORY DROPDOWN */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}

        </select>

        {/* Difficulty */}
        <select
          name="difficulty"
          value={form.difficulty}
          className="w-full border p-3 rounded"
          onChange={handleChange}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        {/* Duration */}
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          value={form.duration}
          required
        />

        {/* Calories */}
        <input
          type="number"
          name="caloriesBurn"
          placeholder="Calories Burn"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          value={form.caloriesBurn}
        />

        {/* Video */}
        <input
          type="text"
          name="videoUrl"
          placeholder="YouTube Video URL"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          value={form.videoUrl}
        />

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />

        {/* Benefits */}
        <div>
          <h3 className="font-semibold mb-2">Benefits</h3>

          {form.benefits.map((b, i) => (
            <input
              key={i}
              className="w-full border p-2 mb-2 rounded"
              value={b}
              onChange={(e) =>
                handleArrayChange(i, "benefits", e.target.value)
              }
            />
          ))}

          <button
            type="button"
            onClick={() => addField("benefits")}
            className="text-blue-600"
          >
            + Add Benefit
          </button>
        </div>

        {/* Steps */}
        <div>
          <h3 className="font-semibold mb-2">Steps</h3>

          {form.steps.map((s, i) => (
            <input
              key={i}
              className="w-full border p-2 mb-2 rounded"
              value={s}
              onChange={(e) =>
                handleArrayChange(i, "steps", e.target.value)
              }
            />
          ))}

          <button
            type="button"
            onClick={() => addField("steps")}
            className="text-blue-600"
          >
            + Add Step
          </button>
        </div>

        {/* Cautions */}
        <div>
          <h3 className="font-semibold mb-2">Cautions</h3>

          {form.cautions.map((c, i) => (
            <input
              key={i}
              className="w-full border p-2 mb-2 rounded"
              value={c}
              onChange={(e) =>
                handleArrayChange(i, "cautions", e.target.value)
              }
            />
          ))}

          <button
            type="button"
            onClick={() => addField("cautions")}
            className="text-blue-600"
          >
            + Add Caution
          </button>
        </div>

        {/* Tags */}
        <div>
          <h3 className="font-semibold mb-2">Tags</h3>

          {form.tags.map((t, i) => (
            <input
              key={i}
              className="w-full border p-2 mb-2 rounded"
              value={t}
              onChange={(e) =>
                handleArrayChange(i, "tags", e.target.value)
              }
            />
          ))}

          <button
            type="button"
            onClick={() => addField("tags")}
            className="text-blue-600"
          >
            + Add Tag
          </button>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-3 rounded"
        >
          Submit Yoga
        </button>

      </form>

    </div>

  );

}

export default AddYoga;
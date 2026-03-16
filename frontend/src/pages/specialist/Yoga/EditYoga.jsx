import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMyYoga, updateYoga } from "../../../services/yogaService";
import API from "../../../services/api";

function EditYoga() {

  const { id } = useParams();
  const navigate = useNavigate();

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

  const [currentImage, setCurrentImage] = useState("");

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

  /* ===============================
     LOAD EXISTING YOGA
  =============================== */

  useEffect(() => {

    const loadYoga = async () => {

      try {

        const yogaList = await getMyYoga();
        const yoga = yogaList.find((y) => y._id === id);

        if (!yoga) return;

        setForm({
          title: yoga.title || "",
          subtitle: yoga.subtitle || "",
          description: yoga.description || "",
          category: yoga.category || "",
          difficulty: yoga.difficulty || "Beginner",
          duration: yoga.duration || "",
          caloriesBurn: yoga.caloriesBurn || "",
          videoUrl: yoga.videoUrl || "",
          benefits: yoga.benefits?.length ? yoga.benefits : [""],
          steps: yoga.steps?.length ? yoga.steps : [""],
          cautions: yoga.cautions?.length ? yoga.cautions : [""],
          tags: yoga.tags?.length ? yoga.tags : [""],
          image: null
        });

        setCurrentImage(yoga.image);

      } catch (error) {

        console.log(error);

      }

    };

    loadYoga();

  }, [id]);



  /* ===============================
     INPUT HANDLERS
  =============================== */

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



  /* ===============================
     SUBMIT
  =============================== */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await updateYoga(id, form);

      alert("Yoga updated successfully");

      navigate("/specialist/yoga");

    } catch (error) {

      alert(error.response?.data?.message || "Error updating yoga");

    }

  };



  return (

    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">

      <h2 className="text-2xl font-bold mb-6">Edit Yoga</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TITLE */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Yoga Title"
        />

        {/* SUBTITLE */}
        <input
          type="text"
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Subtitle"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Description"
        />

        {/* CATEGORY DROPDOWN */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >

          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}

        </select>

        {/* DIFFICULTY */}
        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        {/* DURATION */}
        <input
          type="number"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Duration (minutes)"
        />

        {/* CALORIES */}
        <input
          type="number"
          name="caloriesBurn"
          value={form.caloriesBurn}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Calories Burn"
        />

        {/* VIDEO */}
        <input
          type="text"
          name="videoUrl"
          value={form.videoUrl}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="YouTube Video URL"
        />

        {/* CURRENT IMAGE */}
        {currentImage && (
          <img
            src={currentImage}
            alt="Yoga"
            className="w-48 rounded"
          />
        )}

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
        />


        {/* BENEFITS */}
        <div>
          <h3 className="font-semibold mb-2">Benefits</h3>

          {form.benefits.map((b, i) => (
            <input
              key={i}
              value={b}
              onChange={(e) =>
                handleArrayChange(i, "benefits", e.target.value)
              }
              className="w-full border p-2 mb-2 rounded"
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


        {/* STEPS */}
        <div>
          <h3 className="font-semibold mb-2">Steps</h3>

          {form.steps.map((s, i) => (
            <input
              key={i}
              value={s}
              onChange={(e) =>
                handleArrayChange(i, "steps", e.target.value)
              }
              className="w-full border p-2 mb-2 rounded"
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


        {/* CAUTIONS */}
        <div>
          <h3 className="font-semibold mb-2">Cautions</h3>

          {form.cautions.map((c, i) => (
            <input
              key={i}
              value={c}
              onChange={(e) =>
                handleArrayChange(i, "cautions", e.target.value)
              }
              className="w-full border p-2 mb-2 rounded"
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


        {/* TAGS */}
        <div>
          <h3 className="font-semibold mb-2">Tags</h3>

          {form.tags.map((t, i) => (
            <input
              key={i}
              value={t}
              onChange={(e) =>
                handleArrayChange(i, "tags", e.target.value)
              }
              className="w-full border p-2 mb-2 rounded"
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
          Update Yoga
        </button>

      </form>

    </div>

  );

}

export default EditYoga;
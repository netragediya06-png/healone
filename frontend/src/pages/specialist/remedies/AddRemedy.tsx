import React, { useEffect, useState } from "react";
import remedyService from "../../../services/remedyService";
import { useNavigate } from "react-router-dom";

interface Ingredient {
  name: string;
  quantity: string;
  purpose: string;
}

const AddRemedy = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    usage: "",
    difficulty: "Easy",
    duration: "",
    bestTimeToUse: "",

    symptoms: [""],
    steps: [""],
    benefits: [""],
    precautions: [""],
    tags: [""],
    doshaAffinity: [] as string[],
    ingredients: [{ name: "", quantity: "", purpose: "" }] as Ingredient[],
  });

  const [image, setImage] = useState<File | null>(null);
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ======================== */
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index: number, type: any, value: string) => {
    const arr = [...(formData as any)[type]];
    arr[index] = value;
    setFormData({ ...formData, [type]: arr });
  };

  const addField = (type: any) => {
    setFormData({
      ...formData,
      [type]: [...(formData as any)[type], ""],
    });
  };

  const handleIngredientChange = (
    index: number,
    field: keyof Ingredient,
    value: string,
  ) => {
    const updated = [...formData.ingredients];
    updated[index][field] = value;
    setFormData({ ...formData, ingredients: updated });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [
        ...formData.ingredients,
        { name: "", quantity: "", purpose: "" },
      ],
    });
  };

  const handleImage = (e: any) => {
    if (e.target.files) setImage(e.target.files[0]);
  };

  const cleanArray = (arr: any[]) =>
    arr.filter((item) => {
      if (typeof item === "string") return item.trim() !== "";
      if (typeof item === "object") return item.name?.trim() !== "";
      return true;
    });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = new FormData();

    const cleanedData = {
      ...formData,
      symptoms: cleanArray(formData.symptoms),
      steps: cleanArray(formData.steps),
      benefits: cleanArray(formData.benefits),
      precautions: cleanArray(formData.precautions),
      tags: cleanArray(formData.tags),
      ingredients: cleanArray(formData.ingredients),
    };

    Object.entries(cleanedData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value as string);
      }
    });

    if (image) data.append("image", image);

    try {
      setLoading(true);
      await remedyService.createRemedy(data, token);

      alert("Remedy submitted for approval ✅");
      navigate("/specialist/remedies");
    } catch (err) {
      console.error(err);
      alert("Error creating remedy ❌");
    }

    setLoading(false);
  };

  /* ======================== UI ======================== */

  return (
    <div className="max-w-5xl mx-auto p-8 bg-card rounded-2xl shadow-elevated space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gradient-primary">Add Remedy</h2>
        <p className="text-muted-foreground text-sm">
          Share your Ayurvedic knowledge 🌿
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BASIC INFO */}
        <div className="grid md:grid-cols-2 gap-5">
          <input
            name="title"
            placeholder="Title"
            onChange={handleChange}
            className="input-premium"
            required
          />
          <input
            name="subtitle"
            placeholder="Subtitle"
            onChange={handleChange}
            className="input-premium"
          />
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="input-premium md:col-span-2"
            required
          />
          <select
            name="category"
            onChange={handleChange}
            className="input-premium"
            required
          >
            <option value="">Select Category</option>

            {categories.map((cat: any) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            name="duration"
            placeholder="Duration (10 mins)"
            onChange={handleChange}
            className="input-premium"
          />
          <select
            name="bestTimeToUse"
            onChange={handleChange}
            className="input-premium"
          >
            <option value="">Best Time</option>
            <option value="Morning">Morning 🌅</option>
            <option value="Afternoon">Afternoon ☀️</option>
            <option value="Evening">Evening 🌇</option>
            <option value="Night">Night 🌙</option>
          </select>
        </div>

        {/* IMAGE */}
        <div>
          <label className="text-sm font-medium">Upload Image</label>
          <input type="file" onChange={handleImage} className="mt-2" />
        </div>

        {/* INGREDIENTS */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Ingredients</h3>

          {formData.ingredients.map((ing, i) => (
            <div
              key={i}
              className="grid md:grid-cols-4 gap-3 mb-3 items-center"
            >
              <input
                placeholder="Name"
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(i, "name", e.target.value)
                }
                className="input-premium"
              />

              <input
                placeholder="Quantity"
                value={ing.quantity}
                onChange={(e) =>
                  handleIngredientChange(i, "quantity", e.target.value)
                }
                className="input-premium"
              />

              <input
                placeholder="Purpose"
                value={ing.purpose}
                onChange={(e) =>
                  handleIngredientChange(i, "purpose", e.target.value)
                }
                className="input-premium"
              />

              {/* REMOVE BUTTON */}
              <button
                type="button"
                onClick={() => {
                  const arr = [...formData.ingredients];
                  if (arr.length === 1) return;
                  arr.splice(i, 1);
                  setFormData({ ...formData, ingredients: arr });
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredient}
            className="btn-premium text-sm"
          >
            + Add Ingredient
          </button>
        </div>

        {/* ARRAY SECTIONS */}
        {["symptoms", "steps", "benefits", "precautions"].map((type) => (
          <div key={type}>
            <h3 className="font-semibold text-lg mb-3 capitalize">{type}</h3>

            {(formData as any)[type].map((item: string, i: number) => (
              <div key={i} className="flex gap-2 mb-2 items-center">
                <input
                  value={item}
                  onChange={(e) => handleArrayChange(i, type, e.target.value)}
                  className="input-premium w-full"
                  placeholder={`${type} ${i + 1}`}
                />

                {/* REMOVE BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    const arr = [...(formData as any)[type]];
                    if (arr.length === 1) return;
                    arr.splice(i, 1);
                    setFormData({ ...formData, [type]: arr });
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl"
                >
                  -
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addField(type)}
              className="btn-premium text-sm"
            >
              + Add
            </button>
          </div>
        ))}

        {/* SUBMIT */}
        <button disabled={loading} className="btn-premium w-full text-lg">
          {loading ? "Submitting..." : "Submit Remedy"}
        </button>
      </form>
    </div>
  );
};

export default AddRemedy;

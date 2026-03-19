import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import remedyService from "../../../services/remedyService";

interface Ingredient {
  name: string;
  quantity: string;
  purpose: string;
}

const EditRemedy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "";

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
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
  /* ================= FETCH ================= */
  useEffect(() => {
    fetchRemedy();
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
  /* ========================
     FETCH REMEDY
  ======================== */
  useEffect(() => {
    fetchRemedy();
  }, []);

  const fetchRemedy = async () => {
    try {
      const remedies = await remedyService.getMyRemedies(token);
      const remedy = remedies.find((r: any) => r._id === id);

      if (remedy) {
        setFormData({
          title: remedy.title || "",
          subtitle: remedy.subtitle || "",
          description: remedy.description || "",
          category: remedy.category || "",
          usage: remedy.usage || "",
          difficulty: remedy.difficulty || "Easy",
          duration: remedy.duration || "",
          bestTimeToUse: remedy.bestTimeToUse || "",

          symptoms: remedy.symptoms?.length ? remedy.symptoms : [""],
          steps: remedy.steps?.length ? remedy.steps : [""],
          benefits: remedy.benefits?.length ? remedy.benefits : [""],
          precautions: remedy.precautions?.length ? remedy.precautions : [""],
          tags: remedy.tags?.length ? remedy.tags : [""],
          doshaAffinity: remedy.doshaAffinity || [],

          ingredients: remedy.ingredients?.length
            ? remedy.ingredients
            : [{ name: "", quantity: "", purpose: "" }],
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ========================
     HANDLERS
  ======================== */

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

  /* INGREDIENT */
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

  /* IMAGE */
  const handleImage = (e: any) => {
    if (e.target.files) setImage(e.target.files[0]);
  };
  /* ================= CLEAN ================= */

  const cleanArray = (arr: any[]) =>
    arr.filter((item) => {
      if (typeof item === "string") return item.trim() !== "";
      if (typeof item === "object") return item.name?.trim() !== "";
      return true;
    });

  /* ========================
     SUBMIT
  ======================== */
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        data.append(key, JSON.stringify(value));
      } else {
        data.append(key, value as string);
      }
    });

    if (image) data.append("image", image);

    try {
      setLoading(true);

      await remedyService.updateRemedy(id!, data, token);

      alert("Remedy updated. Waiting for approval ✅");
      navigate("/specialist/remedies");
    } catch (err) {
      console.error(err);
      alert("Error updating remedy ❌");
    }

    setLoading(false);
  };

  /* ========================
     UI
  ======================== */

  return (
    <div className="max-w-5xl mx-auto p-8 bg-card rounded-2xl shadow-elevated space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gradient-primary">
          Edit Remedy
        </h2>
        <p className="text-muted-foreground text-sm">Update your remedy 🌿</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* BASIC */}
        <div className="grid md:grid-cols-2 gap-5">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input-premium"
          />
          <input
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="input-premium"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-premium md:col-span-2"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-premium"
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
            value={formData.duration}
            onChange={handleChange}
            className="input-premium"
          />
          <select
            name="bestTimeToUse"
            value={formData.bestTimeToUse}
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
        <input type="file" onChange={handleImage} />

        {/* INGREDIENTS */}
        <div>
          <h3 className="font-semibold text-lg mb-3">Ingredients</h3>

          {formData.ingredients.map((ing, i) => (
            <div
              key={i}
              className="grid md:grid-cols-4 gap-3 mb-3 items-center"
            >
              <input
                value={ing.name}
                onChange={(e) =>
                  handleIngredientChange(i, "name", e.target.value)
                }
                className="input-premium"
                placeholder="Name"
              />

              <input
                value={ing.quantity}
                onChange={(e) =>
                  handleIngredientChange(i, "quantity", e.target.value)
                }
                className="input-premium"
                placeholder="Quantity"
              />

              <input
                value={ing.purpose}
                onChange={(e) =>
                  handleIngredientChange(i, "purpose", e.target.value)
                }
                className="input-premium"
                placeholder="Purpose"
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

        {/* ARRAYS */}
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
          {loading ? "Updating..." : "Update Remedy"}
        </button>
      </form>
    </div>
  );
};

export default EditRemedy;

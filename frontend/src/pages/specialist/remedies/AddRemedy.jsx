import React, { useState } from "react";
import axios from "axios";

const AddRemedy = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);
  const [healthCategory, setHealthCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId"); // make sure stored on login

  // Handle ingredient change
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  // Add ingredient field
  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  // Handle step change
  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/api/remedies/specialist",
        {
          title,
          ingredients,
          steps,
          healthCategory,
        },
        {
          headers: {
            userid: userId,
          },
        }
      );

      alert("Remedy submitted for approval ✅");

      // Reset form
      setTitle("");
      setIngredients([""]);
      setSteps([""]);
      setHealthCategory("");

    } catch (error) {
      alert(error.response?.data?.message || "Error creating remedy");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Remedy</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Title */}
        <input
          type="text"
          placeholder="Remedy Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />

        {/* Health Category */}
        <input
          type="text"
          placeholder="Health Category (e.g. Immunity)"
          value={healthCategory}
          onChange={(e) => setHealthCategory(e.target.value)}
          required
          style={styles.input}
        />

        {/* Ingredients */}
        <h4>Ingredients</h4>
        {ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Ingredient ${index + 1}`}
            value={ingredient}
            onChange={(e) =>
              handleIngredientChange(index, e.target.value)
            }
            required
            style={styles.input}
          />
        ))}
        <button type="button" onClick={addIngredient} style={styles.smallBtn}>
          + Add Ingredient
        </button>

        {/* Steps */}
        <h4>Steps</h4>
        {steps.map((step, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Step ${index + 1}`}
            value={step}
            onChange={(e) => handleStepChange(index, e.target.value)}
            required
            style={styles.input}
          />
        ))}
        <button type="button" onClick={addStep} style={styles.smallBtn}>
          + Add Step
        </button>

        {/* Submit */}
        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading ? "Submitting..." : "Submit Remedy"}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#f9fdf9",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2e7d32",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  smallBtn: {
    padding: "6px 10px",
    backgroundColor: "#4caf50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "fit-content",
  },
  submitBtn: {
    padding: "12px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: "bold",
  },
};

export default AddRemedy;
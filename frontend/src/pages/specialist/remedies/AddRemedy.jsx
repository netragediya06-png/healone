import { useState } from "react";
import { useNavigate } from "react-router-dom";
import remedyService from "../../../services/remedyService";

function AddRemedy() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    healthCategory: "",
  });

  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, value, type) => {
    const updatedArray = type === "ingredients" ? [...ingredients] : [...steps];
    updatedArray[index] = value;

    type === "ingredients"
      ? setIngredients(updatedArray)
      : setSteps(updatedArray);
  };

  const addField = (type) => {
    type === "ingredients"
      ? setIngredients([...ingredients, ""])
      : setSteps([...steps, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formData,
      ingredients,
      steps,
    };

    try {
      await remedyService.createRemedy(data, user._id);
      alert("Remedy submitted for approval!");
      navigate("/specialist/my-remedies");
    } catch (error) {
      console.error(error);
      alert("Error creating remedy");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add New Remedy</h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Health Category</label>
          <input
            type="text"
            name="healthCategory"
            className="form-control"
            value={formData.healthCategory}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Ingredients</label>
          {ingredients.map((item, index) => (
            <input
              key={index}
              type="text"
              className="form-control mb-2"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, e.target.value, "ingredients")
              }
              required
            />
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => addField("ingredients")}
          >
            + Add Ingredient
          </button>
        </div>

        <div className="mb-3">
          <label>Steps</label>
          {steps.map((item, index) => (
            <input
              key={index}
              type="text"
              className="form-control mb-2"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, e.target.value, "steps")
              }
              required
            />
          ))}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => addField("steps")}
          >
            + Add Step
          </button>
        </div>

        <button type="submit" className="btn btn-success">
          Submit Remedy
        </button>
      </form>
    </div>
  );
}

export default AddRemedy;

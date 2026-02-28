import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import remedyService from "../../../services/remedyService";
import axios from "axios";

const API_URL = "http://localhost:5000/api/remedies";

function EditRemedy() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    title: "",
    healthCategory: "",
  });

  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  useEffect(() => {
    fetchRemedy();
  }, []);

  const fetchRemedy = async () => {
    try {
      const response = await axios.get(`${API_URL}/my`, {
        headers: { userid: user._id },
      });

      const remedy = response.data.find((r) => r._id === id);

      if (remedy) {
        setFormData({
          title: remedy.title,
          healthCategory: remedy.healthCategory,
        });

        setIngredients(remedy.ingredients || [""]);
        setSteps(remedy.steps || [""]);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
      await remedyService.updateRemedy(id, data, user._id);
      alert("Remedy updated! Waiting for admin approval.");
      navigate("/specialist/my-remedies");
    } catch (error) {
      console.error(error);
      alert("Error updating remedy");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Edit Remedy</h3>

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
          Update Remedy
        </button>
      </form>
    </div>
  );
}

export default EditRemedy;

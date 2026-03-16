import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProgram, updateProgram } from "../../../services/programService";
import API from "../../../services/api";

function EditProgram() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    durationDays: "",
    programLevel: "Beginner",
    startDate: "",
    endDate: "",
    seatsLimit: ""
  });

  const [benefits, setBenefits] = useState([]);
  const [plans, setPlans] = useState([]);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");



  useEffect(() => {
    loadProgram();
    loadCategories();
  }, []);



  const loadProgram = async () => {

    try {

      const res = await getProgram(id);
      const program = res.data;

      setForm({
        title: program.title || "",
        description: program.description || "",
        category: program.category || "",
        durationDays: program.durationDays || "",
        programLevel: program.programLevel || "Beginner",
        startDate: program.startDate
          ? program.startDate.split("T")[0]
          : "",
        endDate: program.endDate
          ? program.endDate.split("T")[0]
          : "",
        seatsLimit: program.seatsLimit || ""
      });

      setBenefits(program.benefits || []);
      setPlans(program.plans || []);
      setPreview(program.coverImage || "");

    } catch (error) {
      console.error(error);
    }

  };


  const loadCategories = async () => {

    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (error) {
      console.error("Category load error:", error);
    }

  };


  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };


  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));

  };


  const handleBenefitChange = (index, value) => {

    const updated = [...benefits];
    updated[index] = value;

    setBenefits(updated);

  };


  const addBenefit = () => {

    setBenefits([...benefits, ""]);

  };


  const removeBenefit = (index) => {

    const updated = benefits.filter((_, i) => i !== index);
    setBenefits(updated);

  };


  const handlePlanChange = (index, field, value) => {

    const updated = [...plans];
    updated[index][field] = value;

    setPlans(updated);

  };


  const handleFeatureChange = (planIndex, featureIndex, value) => {

    const updated = [...plans];
    updated[planIndex].features[featureIndex] = value;

    setPlans(updated);

  };


  const addFeature = (planIndex) => {

    const updated = [...plans];
    updated[planIndex].features.push("");

    setPlans(updated);

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const data = new FormData();

      Object.keys(form).forEach(key => {
        data.append(key, form[key]);
      });

      data.append("benefits", JSON.stringify(benefits));
      data.append("plans", JSON.stringify(plans));

      if (image) {
        data.append("image", image);
      }

      await updateProgram(id, data);

      alert("Program updated successfully");

      navigate("/specialist/programs");

    } catch (error) {

      console.error(error);
      alert("Update failed");

    }

  };


  return (

    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 border mt-10">

      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Edit Wellness Program
      </h2>


      <form onSubmit={handleSubmit} className="space-y-8">


        {/* BASIC INFO */}

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Program Title"
            required
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
          >

            <option value="">Select Category</option>

            {categories.map((cat) => (

              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>

            ))}

          </select>

        </div>



        {/* DESCRIPTION */}

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Program Description"
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
        />



        {/* DETAILS */}

        <div className="grid md:grid-cols-3 gap-6">

          <input
            type="number"
            name="durationDays"
            value={form.durationDays}
            onChange={handleChange}
            placeholder="Duration (Days)"
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="number"
            name="seatsLimit"
            value={form.seatsLimit}
            onChange={handleChange}
            placeholder="Seats Limit"
            className="border rounded-lg px-4 py-3"
          />

          <select
            name="programLevel"
            value={form.programLevel}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          >

            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>

          </select>

        </div>



        {/* DATES */}

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

        </div>



        {/* IMAGE */}

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">

          {preview && (

            <img
              src={preview}
              alt="preview"
              className="w-40 mx-auto mb-4 rounded-lg"
            />

          )}

          <input
            type="file"
            onChange={handleImage}
            className="cursor-pointer"
          />

          <p className="text-gray-500 text-sm mt-2">
            Upload new program image
          </p>

        </div>



        {/* BENEFITS */}

        <div className="bg-gray-50 p-6 rounded-xl">

          <h3 className="text-lg font-semibold mb-4">
            Program Benefits
          </h3>

          {benefits.map((benefit, index) => (

            <div key={index} className="flex gap-3 mb-3">

              <input
                type="text"
                value={benefit}
                onChange={(e) =>
                  handleBenefitChange(index, e.target.value)
                }
                placeholder="Benefit"
                className="flex-1 border rounded-lg px-4 py-2"
              />

              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="text-red-500"
              >
                Remove
              </button>

            </div>

          ))}

          <button
            type="button"
            onClick={addBenefit}
            className="text-green-600 font-medium"
          >
            + Add Benefit
          </button>

        </div>



        {/* PLANS */}

        <div>

          <h3 className="text-xl font-semibold mb-4">
            Pricing Plans
          </h3>

          {plans.map((plan, pIndex) => (

            <div
              key={pIndex}
              className="border rounded-xl p-6 shadow-sm mb-6"
            >

              <div className="grid md:grid-cols-3 gap-4 mb-4">

                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) =>
                    handlePlanChange(pIndex, "name", e.target.value)
                  }
                  placeholder="Plan Name"
                  className="border rounded-lg px-4 py-2"
                />

                <input
                  type="number"
                  value={plan.price}
                  onChange={(e) =>
                    handlePlanChange(pIndex, "price", e.target.value)
                  }
                  placeholder="Price"
                  className="border rounded-lg px-4 py-2"
                />

                <select
                  value={plan.billingType}
                  onChange={(e) =>
                    handlePlanChange(pIndex, "billingType", e.target.value)
                  }
                  className="border rounded-lg px-4 py-2"
                >

                  <option value="one-time">One Time</option>
                  <option value="monthly">Monthly</option>

                </select>

              </div>


              <h4 className="font-semibold mb-2">Features</h4>

              {plan.features.map((feature, fIndex) => (

                <input
                  key={fIndex}
                  type="text"
                  value={feature}
                  onChange={(e) =>
                    handleFeatureChange(pIndex, fIndex, e.target.value)
                  }
                  placeholder="Feature"
                  className="border rounded-lg px-4 py-2 mb-2 w-full"
                />

              ))}

              <button
                type="button"
                onClick={() => addFeature(pIndex)}
                className="text-green-600 text-sm"
              >
                + Add Feature
              </button>

            </div>

          ))}

        </div>



        {/* SUBMIT */}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          Update Program
        </button>


      </form>

    </div>

  );

}

export default EditProgram;
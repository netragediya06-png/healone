import { useState, useEffect } from "react";
import { createProgram } from "../../../services/programService";
import API from "../../../services/api";

function CreateProgram() {

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

  const [categories, setCategories] = useState([]);
  const [benefits, setBenefits] = useState([""]);

  const [plans, setPlans] = useState([
    { name: "Basic", price: "", billingType: "one-time", features: [""] }
  ]);

  const [image, setImage] = useState(null);


  useEffect(() => {
    loadCategories();
  }, []);

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


  const handleFeatureChange = (planIndex, featureIndex, value) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features[featureIndex] = value;
    setPlans(updatedPlans);
  };

  const addFeature = (planIndex) => {
    const updatedPlans = [...plans];
    updatedPlans[planIndex].features.push("");
    setPlans(updatedPlans);
  };

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index][field] = value;
    setPlans(updatedPlans);
  };

  const addPlan = () => {
    setPlans([
      ...plans,
      { name: "", price: "", billingType: "one-time", features: [""] }
    ]);
  };


  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach(key => {
      data.append(key, form[key]);
    });

    data.append("benefits", JSON.stringify(benefits));
    data.append("plans", JSON.stringify(plans));

    if (image) {
      data.append("image", image);
    }

    try {

      await createProgram(data);

      alert("Program created successfully");

      setForm({
        title: "",
        description: "",
        category: "",
        durationDays: "",
        programLevel: "Beginner",
        startDate: "",
        endDate: "",
        seatsLimit: ""
      });

      setBenefits([""]);

      setPlans([
        { name: "Basic", price: "", billingType: "one-time", features: [""] }
      ]);

      setImage(null);

    } catch (error) {

      console.error(error);
      alert("Error creating program");

    }

  };


  return (

    <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 border mt-10">

      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Create Wellness Program
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC INFO */}

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            name="title"
            placeholder="Program Title"
            value={form.title}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
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
          placeholder="Program Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
        />


        {/* DETAILS */}

        <div className="grid md:grid-cols-3 gap-6">

          <input
            type="number"
            name="durationDays"
            placeholder="Duration (Days)"
            value={form.durationDays}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
          />

          <input
            type="number"
            name="seatsLimit"
            placeholder="Seats Limit"
            value={form.seatsLimit}
            onChange={handleChange}
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

          <input
            type="file"
            onChange={handleImage}
            className="cursor-pointer"
          />

          <p className="text-gray-500 text-sm mt-2">
            Upload program cover image
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
                  placeholder="Plan Name"
                  value={plan.name}
                  onChange={(e) =>
                    handlePlanChange(pIndex, "name", e.target.value)
                  }
                  className="border rounded-lg px-4 py-2"
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={plan.price}
                  onChange={(e) =>
                    handlePlanChange(pIndex, "price", e.target.value)
                  }
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

          <button
            type="button"
            onClick={addPlan}
            className="bg-gray-100 px-4 py-2 rounded-lg"
          >
            Add Plan
          </button>

        </div>


        {/* SUBMIT */}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          Create Program
        </button>

      </form>

    </div>

  );

}

export default CreateProgram;
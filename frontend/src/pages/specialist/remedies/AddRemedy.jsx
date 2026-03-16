import React, { useState, useEffect } from "react";
import remedyService from "../../../services/remedyService";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddRemedy() {

const navigate = useNavigate();
const token = localStorage.getItem("token");

const [categories,setCategories] = useState([]);

const [formData,setFormData] = useState({
title:"",
healthCategory:"",
usage:"",
benefits:"",
precautions:"",
symptoms:[""],
ingredients:[""],
steps:[""]
});

const [image,setImage] = useState(null);
const [loading,setLoading] = useState(false);


/* ================================
   FETCH CATEGORIES
================================ */

useEffect(()=>{
fetchCategories();
},[]);

const fetchCategories = async ()=>{

try{

const res = await axios.get(
"http://localhost:5000/api/categories"
);

setCategories(res.data);

}catch(err){
console.error(err);
}

};


/* ================================
   INPUT CHANGE
================================ */

const handleChange=(e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};


/* ================================
   ARRAY CHANGE
================================ */

const handleArrayChange=(index,type,value)=>{

const arr=[...formData[type]];
arr[index]=value;

setFormData({
...formData,
[type]:arr
});

};


/* ================================
   ADD FIELD
================================ */

const addField=(type)=>{

setFormData({
...formData,
[type]:[...formData[type],""]
});

};


/* ================================
   IMAGE CHANGE
================================ */

const handleImageChange = (e) => {

const file = e.target.files[0];

if(file){

setImage(file);

}

};


/* ================================
   SUBMIT
================================ */

const handleSubmit=async(e)=>{

e.preventDefault();

const data=new FormData();

/* TEXT FIELDS */

data.append("title",formData.title);
data.append("healthCategory",formData.healthCategory);
data.append("usage",formData.usage);
data.append("benefits",formData.benefits);
data.append("precautions",formData.precautions);

/* ARRAYS AS JSON */

data.append("symptoms",JSON.stringify(formData.symptoms));
data.append("ingredients",JSON.stringify(formData.ingredients));
data.append("steps",JSON.stringify(formData.steps));

/* IMAGE */

if(image){
data.append("image",image);
}

try{

setLoading(true);

await remedyService.createRemedy(data,token);

alert("Remedy submitted for admin approval");

navigate("/specialist/remedies");

}catch(err){

console.error(err);
alert("Error creating remedy");

}

setLoading(false);

};


return(

<div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

<h2 className="text-2xl font-semibold mb-6 text-center text-green-700">
Add Remedy
</h2>

<form onSubmit={handleSubmit} className="space-y-5">

{/* TITLE */}

<input
name="title"
placeholder="Remedy Title"
value={formData.title}
onChange={handleChange}
className="w-full border rounded-lg px-4 py-2"
required
/>


{/* CATEGORY */}

<select
name="healthCategory"
value={formData.healthCategory}
onChange={handleChange}
className="w-full border rounded-lg px-4 py-2"
required
>

<option value="">Select Category</option>

{categories.map((cat)=>(
<option key={cat._id} value={cat.name}>
{cat.name}
</option>
))}

</select>


{/* USAGE */}

<textarea
name="usage"
placeholder="Usage"
value={formData.usage}
onChange={handleChange}
className="w-full border rounded-lg px-4 py-2"
/>


{/* BENEFITS */}

<textarea
name="benefits"
placeholder="Benefits"
value={formData.benefits}
onChange={handleChange}
className="w-full border rounded-lg px-4 py-2"
/>


{/* PRECAUTIONS */}

<textarea
name="precautions"
placeholder="Precautions"
value={formData.precautions}
onChange={handleChange}
className="w-full border rounded-lg px-4 py-2"
/>


{/* IMAGE */}

<div>

<label className="block text-sm mb-1">Upload Image</label>

<input
type="file"
accept="image/*"
onChange={handleImageChange}
/>

</div>


{/* SYMPTOMS */}

<div>

<h4 className="font-semibold mb-2">Symptoms</h4>

{formData.symptoms.map((s,i)=>(

<input
key={i}
value={s}
onChange={(e)=>handleArrayChange(i,"symptoms",e.target.value)}
className="border rounded-lg px-3 py-2 w-full mb-2"
placeholder={`Symptom ${i+1}`}
/>

))}

<button
type="button"
onClick={()=>addField("symptoms")}
className="text-sm bg-gray-200 px-3 py-1 rounded"
>
+ Add Symptom
</button>

</div>


{/* INGREDIENTS */}

<div>

<h4 className="font-semibold mb-2">Ingredients</h4>

{formData.ingredients.map((s,i)=>(

<input
key={i}
value={s}
onChange={(e)=>handleArrayChange(i,"ingredients",e.target.value)}
className="border rounded-lg px-3 py-2 w-full mb-2"
placeholder={`Ingredient ${i+1}`}
/>

))}

<button
type="button"
onClick={()=>addField("ingredients")}
className="text-sm bg-gray-200 px-3 py-1 rounded"
>
+ Add Ingredient
</button>

</div>


{/* STEPS */}

<div>

<h4 className="font-semibold mb-2">Steps</h4>

{formData.steps.map((s,i)=>(

<input
key={i}
value={s}
onChange={(e)=>handleArrayChange(i,"steps",e.target.value)}
className="border rounded-lg px-3 py-2 w-full mb-2"
placeholder={`Step ${i+1}`}
/>

))}

<button
type="button"
onClick={()=>addField("steps")}
className="text-sm bg-gray-200 px-3 py-1 rounded"
>
+ Add Step
</button>

</div>


{/* SUBMIT */}

<button
type="submit"
disabled={loading}
className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg"
>

{loading ? "Submitting..." : "Submit Remedy"}

</button>

</form>

</div>

);

}

export default AddRemedy;
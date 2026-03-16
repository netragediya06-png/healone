import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import remedyService from "../../../services/remedyService";
import axios from "axios";

function EditRemedy() {

const { id } = useParams();
const navigate = useNavigate();
const token = localStorage.getItem("token");

const [loading,setLoading] = useState(false);
const [image,setImage] = useState(null);
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

/* ================================
   FETCH DATA
================================ */

useEffect(()=>{
fetchRemedy();
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

const fetchRemedy = async ()=>{

try{

const remedies = await remedyService.getMyRemedies(token);
const remedy = remedies.find(r => r._id === id);

if(remedy){

setFormData({
title:remedy.title || "",
healthCategory:remedy.healthCategory || "",
usage:remedy.usage || "",
benefits:remedy.benefits || "",
precautions:remedy.precautions || "",
symptoms:remedy.symptoms?.length ? remedy.symptoms : [""],
ingredients:remedy.ingredients?.length ? remedy.ingredients : [""],
steps:remedy.steps?.length ? remedy.steps : [""]
});

}

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
   REMOVE FIELD
================================ */

const removeField=(index,type)=>{

const arr=[...formData[type]];

if(arr.length === 1) return;

arr.splice(index,1);

setFormData({
...formData,
[type]:arr
});

};

/* ================================
   IMAGE CHANGE
================================ */

const handleImageChange=(e)=>{

const file=e.target.files[0];

if(file){
setImage(file);
}

};

/* ================================
   SUBMIT
================================ */

const handleSubmit = async(e)=>{

e.preventDefault();

const data=new FormData();

/* TEXT */

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

await remedyService.updateRemedy(id,data,token);

alert("Remedy updated. Waiting for admin approval.");

navigate("/specialist/remedies");

}catch(err){

console.error(err);
alert("Error updating remedy");

}

setLoading(false);

};

/* ================================
   UI
================================ */

return(

<div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

<h2 className="text-2xl font-semibold mb-6 text-center text-green-700">
Edit Remedy
</h2>

<form onSubmit={handleSubmit} className="space-y-5">

{/* TITLE */}

<input
name="title"
placeholder="Remedy Title"
value={formData.title}
onChange={handleChange}
className="w-full border rounded-lg px-4 py-2"
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

{categories.map(cat=>(
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

<label className="block text-sm mb-1">
Upload New Image
</label>

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

<div key={i} className="flex gap-2 mb-2">

<input
value={s}
onChange={(e)=>handleArrayChange(i,"symptoms",e.target.value)}
className="border rounded-lg px-3 py-2 w-full"
/>

<button
type="button"
onClick={()=>removeField(i,"symptoms")}
className="bg-red-500 text-white px-3 rounded"
>
-
</button>

</div>

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

<div key={i} className="flex gap-2 mb-2">

<input
value={s}
onChange={(e)=>handleArrayChange(i,"ingredients",e.target.value)}
className="border rounded-lg px-3 py-2 w-full"
/>

<button
type="button"
onClick={()=>removeField(i,"ingredients")}
className="bg-red-500 text-white px-3 rounded"
>
-
</button>

</div>

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

<div key={i} className="flex gap-2 mb-2">

<input
value={s}
onChange={(e)=>handleArrayChange(i,"steps",e.target.value)}
className="border rounded-lg px-3 py-2 w-full"
/>

<button
type="button"
onClick={()=>removeField(i,"steps")}
className="bg-red-500 text-white px-3 rounded"
>
-
</button>

</div>

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

{loading ? "Updating..." : "Update Remedy"}

</button>

</form>

</div>

);

}

export default EditRemedy;
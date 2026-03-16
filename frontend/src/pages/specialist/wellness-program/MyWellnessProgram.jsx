import { useState, useEffect } from "react";
import axios from "axios";

function MyWellnessProgram(){

const [programs,setPrograms] = useState([]);
const [categories,setCategories] = useState([]);
const [editId,setEditId] = useState(null);
const [preview,setPreview] = useState("");
const [viewProgram,setViewProgram] = useState(null);

const [showForm,setShowForm] = useState(false);
const [showView,setShowView] = useState(false);

const [search,setSearch] = useState("");
const [levelFilter,setLevelFilter] = useState("");

const [formData,setFormData] = useState({
title:"",
description:"",
category:"",
durationDays:"",
price:"",
level:"beginner",
image:""
});

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

/* ================= FETCH ================= */

useEffect(()=>{
fetchPrograms();
fetchCategories();
},[]);


const fetchPrograms = async()=>{
try{

const res = await axios.get(
"http://localhost:5000/api/programs",
{
headers:{ Authorization:`Bearer ${token}` }
}
);

setPrograms(res.data);

}catch(err){
console.log(err);
}
};


const fetchCategories = async()=>{
try{

const res = await axios.get(
"http://localhost:5000/api/categories",
{
headers:{ Authorization:`Bearer ${token}` }
}
);

setCategories(res.data);

}catch(err){
console.log(err);
}
};


/* ================= INPUT ================= */

const handleChange = (e)=>{
setFormData({
...formData,
[e.target.name]:e.target.value
});
};


/* ================= IMAGE ================= */

const handleImage = (e)=>{

const file = e.target.files[0];
if(!file) return;

const reader = new FileReader();

reader.onload = ()=>{
setPreview(reader.result);

setFormData({
...formData,
image:reader.result
});
};

reader.readAsDataURL(file);
};


/* ================= SUBMIT ================= */

const handleSubmit = async(e)=>{
e.preventDefault();

try{

const programData = {
...formData,
specialist:user?._id
};

if(editId){

await axios.put(
`http://localhost:5000/api/programs/${editId}`,
programData,
{
headers:{ Authorization:`Bearer ${token}` }
}
);

}else{

await axios.post(
"http://localhost:5000/api/programs",
programData,
{
headers:{ Authorization:`Bearer ${token}` }
}
);

}

fetchPrograms();
resetForm();
setShowForm(false);

}catch(err){
console.log(err);
}

};


/* ================= RESET ================= */

const resetForm = ()=>{
setEditId(null);

setFormData({
title:"",
description:"",
category:"",
durationDays:"",
price:"",
level:"beginner",
image:""
});

setPreview("");
};


/* ================= EDIT ================= */

const handleEdit = (program)=>{

setEditId(program._id);

setFormData({
title:program.title,
description:program.description,
category:program.category?._id || program.category,
durationDays:program.durationDays,
price:program.price,
level:program.level,
image:program.image
});

setPreview(program.image);
setShowForm(true);

};


/* ================= DELETE ================= */

const handleDelete = async(id)=>{

if(!window.confirm("Delete this program?")) return;

try{

await axios.delete(
`http://localhost:5000/api/programs/${id}`,
{
headers:{ Authorization:`Bearer ${token}` }
}
);

fetchPrograms();

}catch(err){
console.log(err);
}

};


/* ================= VIEW ================= */

const handleView = (program)=>{
setViewProgram(program);
setShowView(true);
};


/* ================= FILTER ================= */

const filteredPrograms = programs.filter((p)=>{

const matchSearch =
p.title.toLowerCase().includes(search.toLowerCase());

const matchLevel =
levelFilter ? p.level === levelFilter : true;

return matchSearch && matchLevel;

});


/* ================= UI ================= */

return(

<div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

{/* HEADER */}

<div className="flex justify-between items-center">

<h2 className="text-2xl font-bold text-gray-800">
My Wellness Programs
</h2>

<button
className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
onClick={()=>{resetForm();setShowForm(true)}}
>
+ Add Program
</button>

</div>


{/* SEARCH + FILTER */}

<div className="grid md:grid-cols-3 gap-4">

<input
type="text"
className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500"
placeholder="Search Program"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
className="border rounded-lg px-4 py-2"
value={levelFilter}
onChange={(e)=>setLevelFilter(e.target.value)}
>

<option value="">All Levels</option>
<option value="beginner">Beginner</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>

</select>

</div>


{/* PROGRAM CARDS */}

<div className="grid md:grid-cols-3 gap-6">

{filteredPrograms.map((program)=>(

<div
key={program._id}
className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
>

<img
src={program.image}
className="w-full h-44 object-cover"
/>

<div className="p-4 space-y-1">

<h3 className="font-semibold">{program.title}</h3>

<p className="text-sm text-gray-500">
Level : {program.level}
</p>

<p className="text-sm text-gray-500">
{program.durationDays} Days
</p>

<p className="font-semibold text-green-600">
₹ {program.price}
</p>

</div>

<div className="flex justify-between p-4 border-t">

<button
className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
onClick={()=>handleView(program)}
>
View
</button>

<button
className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
onClick={()=>handleEdit(program)}
>
Edit
</button>

<button
className="bg-red-600 text-white px-3 py-1 rounded text-sm"
onClick={()=>handleDelete(program._id)}
>
Delete
</button>

</div>

</div>

))}

</div>


{/* VIEW MODAL */}

{showView && viewProgram && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white max-w-lg w-full rounded-xl p-6">

<div className="flex justify-between mb-4">

<h3 className="text-lg font-semibold">
Program Details
</h3>

<button
onClick={()=>setShowView(false)}
>
✕
</button>

</div>

<img
src={viewProgram.image}
className="w-full h-48 object-cover rounded mb-4"
/>

<h4 className="text-lg font-semibold">
{viewProgram.title}
</h4>

<p><b>Level :</b> {viewProgram.level}</p>
<p><b>Duration :</b> {viewProgram.durationDays} Days</p>
<p><b>Price :</b> ₹ {viewProgram.price}</p>
<p><b>Description :</b> {viewProgram.description}</p>

</div>

</div>

)}


{/* ADD / EDIT FORM */}

{showForm && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white w-full max-w-xl rounded-xl p-6">

<div className="flex justify-between mb-4">

<h3 className="text-lg font-semibold">
{editId ? "Edit Program" : "Add Program"}
</h3>

<button onClick={()=>setShowForm(false)}>✕</button>

</div>

<form onSubmit={handleSubmit} className="space-y-3">

<input
className="border rounded-lg px-3 py-2 w-full"
name="title"
placeholder="Program Title"
value={formData.title}
onChange={handleChange}
required
/>

<textarea
className="border rounded-lg px-3 py-2 w-full"
name="description"
placeholder="Description"
value={formData.description}
onChange={handleChange}
required
/>

<select
className="border rounded-lg px-3 py-2 w-full"
name="category"
value={formData.category}
onChange={handleChange}
required
>

<option value="">Select Category</option>

{categories.map((cat)=>(
<option key={cat._id} value={cat._id}>
{cat.name}
</option>
))}

</select>

<input
type="number"
className="border rounded-lg px-3 py-2 w-full"
name="durationDays"
placeholder="Duration Days"
value={formData.durationDays}
onChange={handleChange}
required
/>

<input
type="number"
className="border rounded-lg px-3 py-2 w-full"
name="price"
placeholder="Price"
value={formData.price}
onChange={handleChange}
required
/>

<select
className="border rounded-lg px-3 py-2 w-full"
name="level"
value={formData.level}
onChange={handleChange}
>

<option value="beginner">Beginner</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>

</select>

<input
type="file"
className="border rounded-lg px-3 py-2 w-full"
onChange={handleImage}
/>

{preview &&(

<img
src={preview}
className="w-full h-48 object-cover rounded"
/>

)}

<button
type="submit"
className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded-lg"
>

{editId ? "Update Program" : "Add Program"}

</button>

</form>

</div>

</div>

)}

</div>

);

}

export default MyWellnessProgram;
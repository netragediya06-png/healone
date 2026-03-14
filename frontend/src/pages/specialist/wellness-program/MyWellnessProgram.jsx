import { useState, useEffect } from "react";
import axios from "axios";

function MyWellnessProgram(){

const [programs,setPrograms] = useState([]);
const [categories,setCategories] = useState([]);
const [editId,setEditId] = useState(null);
const [preview,setPreview] = useState("");
const [viewProgram,setViewProgram] = useState(null);

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


// ================= FETCH =================

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


// ================= INPUT =================

const handleChange = (e)=>{

setFormData({
...formData,
[e.target.name]:e.target.value
});

};


// ================= IMAGE =================

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


// ================= SUBMIT =================

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

const modal = window.bootstrap.Modal.getInstance(
document.getElementById("programModal")
);

modal.hide();

}catch(err){

console.log(err);

}

};


// ================= RESET =================

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


// ================= EDIT =================

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

new window.bootstrap.Modal(
document.getElementById("programModal")
).show();

};


// ================= DELETE =================

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


// ================= VIEW =================

const handleView = (program)=>{

setViewProgram(program);

new window.bootstrap.Modal(
document.getElementById("viewModal")
).show();

};


// ================= FILTER =================

const filteredPrograms = programs.filter((p)=>{

const matchSearch =
p.title.toLowerCase().includes(search.toLowerCase());

const matchLevel =
levelFilter ? p.level === levelFilter : true;

return matchSearch && matchLevel;

});


// ================= UI =================

return(

<div className="container-fluid mt-4">


{/* HEADER */}

<div className="d-flex justify-content-between mb-3">

<h2>My Wellness Programs</h2>

<button
className="btn btn-success"
data-bs-toggle="modal"
data-bs-target="#programModal"
onClick={resetForm}
>
+ Add Program
</button>

</div>


{/* SEARCH + FILTER */}

<div className="row mb-4">

<div className="col-md-6">

<input
type="text"
className="form-control"
placeholder="Search Program"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

</div>

<div className="col-md-3">

<select
className="form-control"
value={levelFilter}
onChange={(e)=>setLevelFilter(e.target.value)}
>

<option value="">All Levels</option>
<option value="beginner">Beginner</option>
<option value="intermediate">Intermediate</option>
<option value="advanced">Advanced</option>

</select>

</div>

</div>


{/* PROGRAM CARDS */}

<div className="row">

{filteredPrograms.map((program)=>(

<div className="col-md-4 mb-4" key={program._id}>

<div className="card shadow h-100">

<img
src={program.image}
className="card-img-top"
style={{height:"180px",objectFit:"cover"}}
/>

<div className="card-body">

<h5>{program.title}</h5>

<p>Level : {program.level}</p>

<p>{program.durationDays} Days</p>

<p>₹ {program.price}</p>

</div>

<div className="card-footer d-flex justify-content-between">

<button
className="btn btn-secondary btn-sm"
onClick={()=>handleView(program)}
>
View
</button>

<button
className="btn btn-primary btn-sm"
onClick={()=>handleEdit(program)}
>
Edit
</button>

<button
className="btn btn-danger btn-sm"
onClick={()=>handleDelete(program._id)}
>
Delete
</button>

</div>

</div>

</div>

))}

</div>


{/* VIEW MODAL */}

<div className="modal fade" id="viewModal">

<div className="modal-dialog modal-lg">

<div className="modal-content">

<div className="modal-header">

<h5>Program Details</h5>

<button className="btn-close" data-bs-dismiss="modal"></button>

</div>

<div className="modal-body">

{viewProgram &&(

<>

<img
src={viewProgram.image}
style={{width:"100%",height:"200px",objectFit:"cover"}}
className="mb-3"
/>

<h4>{viewProgram.title}</h4>

<p><b>Level :</b> {viewProgram.level}</p>

<p><b>Duration :</b> {viewProgram.durationDays} Days</p>

<p><b>Price :</b> ₹ {viewProgram.price}</p>

<p><b>Description :</b> {viewProgram.description}</p>

</>

)}

</div>

</div>

</div>

</div>


{/* ADD / EDIT MODAL */}

<div className="modal fade" id="programModal">

<div className="modal-dialog modal-lg">

<div className="modal-content">

<div className="modal-header">

<h5>{editId ? "Edit Program" : "Add Program"}</h5>

<button className="btn-close" data-bs-dismiss="modal"></button>

</div>

<div className="modal-body">

<form onSubmit={handleSubmit}>

<input
className="form-control mb-3"
name="title"
placeholder="Program Title"
value={formData.title}
onChange={handleChange}
required
/>

<textarea
className="form-control mb-3"
name="description"
placeholder="Description"
value={formData.description}
onChange={handleChange}
required
/>

<select
className="form-control mb-3"
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
className="form-control mb-3"
name="durationDays"
placeholder="Duration Days"
value={formData.durationDays}
onChange={handleChange}
required
/>

<input
type="number"
className="form-control mb-3"
name="price"
placeholder="Price"
value={formData.price}
onChange={handleChange}
required
/>

<select
className="form-control mb-3"
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
className="form-control mb-3"
onChange={handleImage}
/>

{preview &&(
<img
src={preview}
style={{width:"100%",height:"200px",objectFit:"cover"}}
/>
)}

<button
type="submit"
className="btn btn-success w-100 mt-3"
>

{editId ? "Update Program" : "Add Program"}

</button>

</form>

</div>

</div>

</div>

</div>

</div>

);

}

export default MyWellnessProgram;
import {useState} from "react";
import axios from "axios";

function ChangePassword(){

const [oldPassword,setOld] = useState("");
const [newPassword,setNew] = useState("");

const handleSubmit = async(e)=>{

e.preventDefault();

await axios.put(
"http://localhost:5000/api/admin/change-password",
{oldPassword,newPassword},
{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`
}
}
);

alert("Password changed");

}

return(

<form onSubmit={handleSubmit}>

<input
type="password"
placeholder="Old Password"
onChange={(e)=>setOld(e.target.value)}
/>

<input
type="password"
placeholder="New Password"
onChange={(e)=>setNew(e.target.value)}
/>

<button>Change Password</button>

</form>

)

}

export default ChangePassword
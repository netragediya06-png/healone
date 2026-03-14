import { useState, useEffect } from "react";
import axios from "axios";

function AdminProfile() {

  const [profile, setProfile] = useState({});

  useEffect(() => {

    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setProfile(res.data);
    })
    .catch(err => {
      console.error("Profile fetch error:", err);
    });

  }, []);

  return (

    <div>

      <h2>Admin Profile</h2>

      {profile.profileImage && (
        <img
          src={`http://localhost:5000${profile.profileImage}`}
          width="100"
          alt="profile"
        />
      )}

      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>

    </div>

  );

}

export default AdminProfile;
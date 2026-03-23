import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const userData = JSON.parse(storedUser);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setLoading(false);
  }, [navigate]);

  if (loading) return <p className="p-4">Loading...</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) throw new Error("User not logged in");
      const userData = JSON.parse(storedUser);

      const updated = await userService.updateProfile(userData._id, formData);

      localStorage.setItem("user", JSON.stringify(updated.data));
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleProfileUpdate} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div>
          <label className="block font-semibold mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <hr className="my-4" />
        <div>
          <label className="block font-semibold mb-1">Old Password</label>
          <input type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Confirm New Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full border rounded p-2" />
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import {
  Package,
  Heart,
  Activity,
  ShoppingCart,
  User,
  Pencil,
} from "lucide-react";

/* ================= TYPES ================= */

type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
};

type Item = {
  _id: string;
  name: string;
};

/* ================= COMPONENT ================= */

const ProfileView = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [savedRemedies, setSavedRemedies] = useState<Item[]>([]);
  const [savedYoga, setSavedYoga] = useState<Item[]>([]);
  const [subscribedPrograms, setSubscribedPrograms] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          navigate("/login");
          return;
        }

        const userData: User = JSON.parse(storedUser);
        setUser(userData);

        // ✅ UPDATED (NO USER ID)
        const remediesRes = await userService.getSavedRemedies();
        const yogaRes = await userService.getSavedYoga();
        const programsRes = await userService.getSubscribedPrograms();

        setSavedRemedies(remediesRes.data || []);
        setSavedYoga(yogaRes.data || []);
        setSubscribedPrograms(programsRes.data || []);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Preview instantly (Instagram feel)
    const preview = URL.createObjectURL(file);
    setPreviewImage(preview);

    setUploading(true);

    try {
      const res = await userService.uploadProfileImage(file);

      if (!user) return;

      const updatedUser: User = {
        ...user,
        profilePhoto: res.data.profilePhoto,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!user) return <p className="p-6">User not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
      {/* ================= RIGHT CONTENT ================= */}
      <div className="flex-1 space-y-6">
        {/* 👤 PROFILE HEADER */}
        <div className="bg-green-100 rounded-2xl shadow p-6 flex items-center gap-5">
          <div className="relative w-fit">
            {/* CLICKABLE IMAGE */}
            <label className="cursor-pointer relative group block">
              <img
                src={
                  previewImage || user?.profilePhoto || "/default-avatar.png"
                }
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow"
              />

              {/* HOVER OVERLAY */}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs">Change</span>
              </div>

              {/* LOADING OVERLAY 🔥 */}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs animate-pulse">
                    Uploading...
                  </span>
                </div>
              )}

              {/* HIDDEN INPUT */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div>
            <h2 className="font-semibold text-gray-800">{user?.email}</h2>
            <p className="text-sm text-gray-500">{user?.phone || "No phone"}</p>
          </div>

          <button
            onClick={() => navigate("/profile/edit")}
            className="ml-auto px-5 py-2 bg-green-600 text-white rounded-full text-sm"
          >
            Edit Profile
          </button>
        </div>

        {/* 📦 DASHBOARD CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => navigate("/account/my-orders")}
            className="bg-white p-5 rounded-xl shadow cursor-pointer"
          >
            <h3 className="font-semibold">Orders</h3>
            <p className="text-sm text-gray-500">Track & manage</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold">Wishlist</h3>
            <p className="text-sm text-gray-500">
              {savedRemedies.length + savedYoga.length} saved
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-semibold">Programs</h3>
            <p className="text-sm text-gray-500">
              {subscribedPrograms.length} active
            </p>
          </div>

          <div
            onClick={() => navigate("/cart")}
            className="bg-white p-5 rounded-xl shadow cursor-pointer"
          >
            <h3 className="font-semibold">Cart</h3>
            <p className="text-sm text-gray-500">View items</p>
          </div>
        </div>

        {/* 📊 RECENT ACTIVITY */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h3 className="font-semibold mb-3">Recent Activity</h3>

          {savedRemedies.length === 0 &&
          savedYoga.length === 0 &&
          subscribedPrograms.length === 0 ? (
            <p className="text-sm text-gray-500">No recent activity yet</p>
          ) : (
            <ul className="text-sm space-y-1 text-gray-600">
              {savedRemedies.slice(0, 2).map((r) => (
                <li key={r._id}>Saved remedy: {r.name}</li>
              ))}
              {savedYoga.slice(0, 2).map((y) => (
                <li key={y._id}>Saved yoga: {y.name}</li>
              ))}
              {subscribedPrograms.slice(0, 2).map((p) => (
                <li key={p._id}>Joined program: {p.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;

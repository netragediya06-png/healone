import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";
import {
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Heart,
  User,
  Brain,
  Briefcase,
  Leaf,
  Home,
  Building,
  FileText,
  CheckCircle,
  Clock,
  Stethoscope,
} from "lucide-react";

/* ================= TYPES ================= */

type User = any;

/* ================= COMPONENT ================= */

const ProfileView = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userService.getMyProfile();
      setUser(res.data);
    } catch (err) {
      console.error("Profile Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewImage(preview);

    setUploading(true);

    try {
      const res = await userService.uploadProfileImage(file);

      if (!user) return;

      const updatedUser = {
        ...user,
        profilePhoto: res.data.profilePhoto,
      };

      setUser(updatedUser);

      // 🔥 ADD THIS (IMPORTANT FIX)
      localStorage.setItem("user", JSON.stringify(updatedUser));
      // 🔥 notify navbar
      window.dispatchEvent(new Event("userUpdated"));
      
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (!user) return <p className="p-6">User not found</p>;

  const isSpecialist = user.roles?.includes("specialist");
  const tabs = [
    { key: "overview", label: "Overview", icon: User },
    { key: "specialist", label: "Specialist", icon: Stethoscope },
    { key: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow p-6 flex items-center gap-5">
        <div className="relative">
          <label className="cursor-pointer group">
            <img
              src={previewImage || user.profilePhoto || "/default-avatar.png"}
              className="w-20 h-20 rounded-full object-cover border-4 border-white"
            />

            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs">
                Uploading...
              </div>
            )}

            <input type="file" hidden onChange={handleImageChange} />
          </label>
        </div>

        <div>
          <h2 className="font-semibold text-lg">{user.fullName}</h2>

          <div className="flex items-center gap-2 text-sm opacity-90">
            <Mail size={14} />
            {user.email}
          </div>

          <div className="flex items-center gap-2 text-sm opacity-90">
            <Phone size={14} />
            {user.phone}
          </div>
        </div>

        <button
          onClick={() => navigate("/account/profile/edit")}
          className="ml-auto bg-white text-green-600 px-4 py-2 rounded-full text-sm font-medium"
        >
          Edit
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-3 border-b pb-2 sticky top-0 bg-white z-10">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                activeTab === tab.key
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ================= TAB CONTENT ================= */}

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <MapPin size={16} />
              <h3 className="font-semibold">Location</h3>
            </div>
            <p>
              {user.location?.city}, {user.location?.state}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Heart size={16} />
              <h3 className="font-semibold">Wishlist</h3>
            </div>
            <p>{user.wishlistProducts?.length} Products</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <User size={16} />
              <h3 className="font-semibold">Languages</h3>
            </div>
            <p>{user.languagesSpoken?.join(", ")}</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <CheckCircle size={16} />
              <h3 className="font-semibold">Status</h3>
            </div>
            <p>{user.verificationStatus}</p>
          </div>
        </div>
      )}

      {/* SPECIALIST */}
      {activeTab === "specialist" && isSpecialist && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* ORGANIZATION */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Building size={16} />
              <h3 className="font-semibold">Organization</h3>
            </div>
            <p>Name: {user.organizationDetails?.organizationName || "-"}</p>
            <p>Type: {user.organizationDetails?.organizationType || "-"}</p>
            <p>
              Experience: {user.organizationDetails?.experienceYears || 0} yrs
            </p>
            <p>Mode: {user.organizationDetails?.consultationMode || "-"}</p>
          </div>

          {/* PROFESSIONAL */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <GraduationCap size={16} />
              <h3 className="font-semibold">Professional</h3>
            </div>
            <p>{user.professionalDetails?.qualification || "-"}</p>
            <p>University: {user.professionalDetails?.university || "-"}</p>
            <p>
              Experience: {user.professionalDetails?.experienceYears || 0} yrs
            </p>
          </div>

          {/* BIO */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <User size={16} />
              <h3 className="font-semibold">Bio</h3>
            </div>
            <p>{user.bio || "-"}</p>
          </div>

          {/* EXPERTISE */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Brain size={16} />
              <h3 className="font-semibold">Expertise</h3>
            </div>
            <p>{user.expertiseSummary || "-"}</p>
          </div>

          {/* SERVICES */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Briefcase size={16} />
              <h3 className="font-semibold">Services</h3>
            </div>
            <p>
              {user.organizationDetails?.servicesOffered?.join(", ") || "-"}
            </p>
          </div>

          {/* TREATMENT */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Leaf size={16} />
              <h3 className="font-semibold">Treatment</h3>
            </div>
            <p>{user.treatmentApproach || "-"}</p>
          </div>

          {/* FACILITIES */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Home size={16} />
              <h3 className="font-semibold">Facilities</h3>
            </div>
            <p>{user.facilities?.join(", ") || "-"}</p>
          </div>

          {/* AVAILABILITY */}
          <div className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Clock size={16} />
              <h3 className="font-semibold">Availability</h3>
            </div>
            <p>{user.availability?.days?.join(", ") || "-"}</p>
            <p>
              {user.availability?.startTime || "-"} -{" "}
              {user.availability?.endTime || "-"}
            </p>
          </div>
        </div>
      )}

      {/* DOCUMENTS */}
      {activeTab === "documents" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl shadow">
            <div className="flex items-center gap-2 text-green-600 mb-3">
              <FileText size={16} />
              <h3 className="font-semibold">Documents</h3>
            </div>

            {user.documents?.length ? (
              user.documents.map((doc: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b py-2"
                >
                  <a
                    href={doc.url}
                    target="_blank"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Document {i + 1}
                  </a>

                  <div className="flex items-center gap-1 text-xs">
                    <CheckCircle
                      size={14}
                      className={
                        doc.verified ? "text-green-600" : "text-gray-400"
                      }
                    />
                    {doc.verified ? "Verified" : "Pending"}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No documents uploaded</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;

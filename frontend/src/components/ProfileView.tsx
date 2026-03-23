import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService";

const ProfileView = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [savedRemedies, setSavedRemedies] = useState<any[]>([]);
  const [savedYoga, setSavedYoga] = useState<any[]>([]);
  const [subscribedPrograms, setSubscribedPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          navigate("/login");
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        // Fetch saved remedies, yoga & programs
        const remediesRes = await userService.getSavedRemedies(userData._id);
        const yogaRes = await userService.getSavedYoga(userData._id);
        const programsRes = await userService.getSubscribedPrograms(userData._id);

        setSavedRemedies(remediesRes.data || []);
        setSavedYoga(yogaRes.data || []);
        setSubscribedPrograms(programsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) return <p className="p-4">User not found</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {/* User Info */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
      </div>

      {/* Saved Remedies */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="font-semibold mb-2">Saved Remedies</h2>
        {savedRemedies.length === 0 ? (
          <p>No remedies saved yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {savedRemedies.map((r) => (
              <li key={r._id}>{r.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Saved Yoga */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="font-semibold mb-2">Saved Yoga</h2>
        {savedYoga.length === 0 ? (
          <p>No yoga saved yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {savedYoga.map((y) => (
              <li key={y._id}>{y.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Subscribed Programs */}
      <div className="mb-6 p-4 border rounded-lg shadow-sm bg-white">
        <h2 className="font-semibold mb-2">Subscribed Programs</h2>
        {subscribedPrograms.length === 0 ? (
          <p>No programs subscribed yet.</p>
        ) : (
          <ul className="list-disc pl-5">
            {subscribedPrograms.map((p) => (
              <li key={p._id}>{p.name}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Profile Button */}
      <div className="mt-4">
        <button
          onClick={() => navigate("/profile/edit")}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
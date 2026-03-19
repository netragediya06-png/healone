import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import remedyService from "../../../services/remedyService";

function MyRemedies() {

  const [remedies, setRemedies] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRemedies();
  }, []);

  const fetchRemedies = async () => {
    try {
      const data = await remedyService.getMyRemedies(token);
      setRemedies(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const deleteRemedy = async (id) => {
    if (!window.confirm("Delete this remedy?")) return;

    try {
      await remedyService.deleteRemedy(id, token);
      fetchRemedies();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-3xl font-bold text-gradient-primary">
            My Remedies
          </h2>

          <p className="text-muted-foreground text-sm">
            Manage your Ayurvedic remedies 🌿
          </p>
        </div>

        <button
          onClick={() => navigate("/specialist/add-remedy")}
          className="btn-premium"
        >
          + Add Remedy
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-muted-foreground">
          Loading remedies...
        </p>
      )}

      {/* EMPTY */}
      {!loading && remedies.length === 0 && (
        <div className="text-center py-24 space-y-4">
          <p className="text-muted-foreground text-lg">
            No remedies yet 🌿
          </p>

          <button
            onClick={() => navigate("/specialist/add-remedy")}
            className="btn-premium"
          >
            Create Your First Remedy
          </button>
        </div>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {remedies.map((remedy) => (

          <div
            key={remedy._id}
            className="group bg-card border border-border rounded-2xl shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden"
          >

            {/* IMAGE */}
            <div className="relative h-44 overflow-hidden">

              <img
                src={remedy.image || "/placeholder.jpg"}
                alt={remedy.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />

              {/* STATUS */}
              <span
                className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full backdrop-blur-md
                ${
                  remedy.status === "Approved"
                    ? "bg-green-500/90 text-white"
                    : remedy.status === "Rejected"
                    ? "bg-red-500/90 text-white"
                    : "bg-yellow-400/90 text-black"
                }`}
              >
                {remedy.status}
              </span>

            </div>

            {/* CONTENT */}
            <div className="p-4 space-y-3">

              {/* TITLE */}
              <h3 className="font-semibold text-base line-clamp-1">
                {remedy.title}
              </h3>

              {/* SUBTITLE */}
              <p className="text-xs text-muted-foreground line-clamp-1">
                {remedy.subtitle}
              </p>

              {/* CATEGORY + DIFFICULTY */}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{remedy.category}</span>
                <span>{remedy.difficulty}</span>
              </div>

              {/* DOSHA */}
              <div className="flex flex-wrap gap-1">
                {remedy.doshaAffinity?.map((d, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 rounded-full bg-accent text-accent-foreground"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* TAGS */}
              <div className="flex flex-wrap gap-1">
                {remedy.tags?.slice(0, 2).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* STATS */}
              <div className="flex justify-between text-xs text-muted-foreground pt-2">
                <span>👁 {remedy.views || 0}</span>
                <span>❤️ {remedy.savedBy?.length || 0}</span>
                <span>⬇ {remedy.downloads || 0}</span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-3">

                <button
                  onClick={() => navigate(`/specialist/edit-remedy/${remedy._id}`)}
                  className="flex-1 text-sm py-2 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteRemedy(remedy._id)}
                  className="flex-1 text-sm py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default MyRemedies;
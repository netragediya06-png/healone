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

        <div className="p-6">

            {/* HEADER */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h2 className="text-2xl font-semibold text-gray-800">
                        My Remedies
                    </h2>

                    <p className="text-sm text-gray-500">
                        Manage your submitted remedies
                    </p>

                </div>

                <button
                    onClick={() => navigate("/specialist/add-remedy")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                    + Add Remedy
                </button>

            </div>


            {/* LOADING */}

            {loading && (
                <p className="text-center text-gray-500">
                    Loading remedies...
                </p>
            )}


            {/* EMPTY STATE */}

            {!loading && remedies.length === 0 && (

                <div className="text-center py-20 text-gray-500">

                    <p className="mb-4">No remedies submitted yet</p>

                    <button
                        onClick={() => navigate("/specialist/add-remedy")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Add Your First Remedy
                    </button>

                </div>

            )}


            {/* GRID */}

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                {remedies.map((remedy) => (

                    <div
                        key={remedy._id}
                        className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                    >

                        {/* IMAGE */}

                        {remedy.image && (
                            <img
                                src={remedy.image}
                                alt={remedy.title}
                                className="w-full h-28 object-contain bg-gray-50 p-2"
                            />
                        )}

                        {/* CONTENT */}

                        <div className="p-4 space-y-2">

                            <div className="flex justify-between items-center">

                                <h3 className="font-semibold text-sm">
                                    {remedy.title}
                                </h3>

                                <span
                                    className={`text-xs px-2 py-1 rounded-full
${remedy.status === "Approved"
                                            ? "bg-green-100 text-green-700"
                                            : remedy.status === "Rejected"
                                                ? "bg-red-100 text-red-600"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >

                                    {remedy.status}

                                </span>

                            </div>

                            <p className="text-xs text-gray-500">
                                {remedy.healthCategory}
                            </p>

                            <div className="flex justify-between text-xs text-gray-400">

                                <span>👁 {remedy.views || 0}</span>
                                <span>❤️ {remedy.savedBy?.length || 0}</span>

                            </div>

                            <div className="flex gap-2 pt-2 flex-wrap">

                                <button
                                    onClick={() => navigate(`/specialist/edit-remedy/${remedy._id}`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteRemedy(remedy._id)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded"
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
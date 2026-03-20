import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPrograms } from "@/services/programService";
import { Button } from "@/components/ui/button";

const ProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    try {
      const res = await getPrograms();

      const found = res.data.find(
        (p: any) => p._id === programId
      );

      setProgram(found);
    } catch (err) {
      console.error(err);
    }
  };

  if (!program) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO SECTION */}
      <div className="relative h-[60vh]">

        <img
          src={program.coverImage || "https://via.placeholder.com/1200x600"}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute bottom-10 left-10 text-white max-w-xl">
          <h1 className="text-4xl font-bold">
            {program.title}
          </h1>

          <p className="mt-2 text-gray-200">
            {program.description}
          </p>

          <div className="flex gap-4 mt-4 text-sm">
            <span>⏳ {program.durationDays} Days</span>
            <span>⭐ {program.rating || 4.5}</span>
            <span>👥 {program.totalEnrollments || 0} enrolled</span>
          </div>

          <Button
            className="mt-5 bg-green-600 hover:bg-green-700"
            onClick={() => navigate(`/subscribe/${program._id}`)}
          >
            Enroll Now
          </Button>
        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* BENEFITS */}
        <h2 className="text-2xl font-bold mb-6">
          What You'll Get
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {program.benefits?.map((b: string, i: number) => (
            <div
              key={i}
              className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition"
            >
              <h3 className="font-semibold mb-2">
                ✔ Benefit {i + 1}
              </h3>
              <p className="text-gray-600 text-sm">
                {b}
              </p>
            </div>
          ))}
        </div>

        {/* PLANS PREVIEW */}
        <h2 className="text-2xl font-bold mt-12 mb-6">
          Plans
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {program.plans?.map((plan: any) => (
            <div
              key={plan.name}
              className="bg-white p-6 rounded-lg shadow text-center"
            >
              <h3 className="text-lg font-semibold">
                {plan.name}
              </h3>

              <p className="text-2xl font-bold text-green-600 mt-2">
                ₹{plan.price}
              </p>

              <Button
                className="mt-4 w-full"
                onClick={() => navigate(`/subscribe/${program._id}`)}
              >
                Choose Plan
              </Button>
            </div>
          ))}
        </div>

      </div>

      {/* STICKY FOOTER CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-between items-center">

        <div>
          <p className="text-sm text-gray-500">Starting from</p>
          <p className="font-bold text-lg text-green-600">
            ₹{program.plans?.[0]?.price || 999}
          </p>
        </div>

        <Button
          onClick={() => navigate(`/subscribe/${program._id}`)}
        >
          Enroll Now
        </Button>

      </div>

    </div>
  );
};

export default ProgramDetail;
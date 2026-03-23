import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import yogaHero from "@/assets/yoga-hero.jpg";
import {
  getApprovedYoga,
  saveYoga,
  unsaveYoga,
  getSavedYoga,
} from "@/services/yogaService";
import YogaDetailDrawer from "@/components/YogaDetailDrawer";

const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const categories = ["All", "Asanas", "Pranayama", "Meditation", "Sequences"];

const Yoga = () => {
  const [yogaPractices, setYogaPractices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLevel, setActiveLevel] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedYoga, setSelectedYoga] = useState<any | null>(null);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchYoga();
    fetchSavedYoga();
  }, []);

  const fetchYoga = async () => {
    try {
      const data = await getApprovedYoga();
      const formatted = data.map((y: any) => ({
        id: y._id,
        title: y.title,
        image: y.image || yogaHero,
        category: y.category,
        level: y.difficulty,
        duration: y.duration + " min",
        calories: y.caloriesBurn || 0,
        description: y.description,
        benefits: y.benefits || [],
        steps: y.steps || [],
        contraindications: y.cautions?.join(", ") || "None",
        rating: y.rating || 4.5,
      }));
      setYogaPractices(formatted);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchSavedYoga = async () => {
    try {
      const saved = await getSavedYoga();
      const ids = saved.map((y: any) => y._id);
      setSavedIds(ids);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (id: string) => {
    try {
      if (savedIds.includes(id)) {
        await unsaveYoga(id);
        setSavedIds((prev) => prev.filter((i) => i !== id));
      } else {
        await saveYoga(id);
        setSavedIds((prev) => [...prev, id]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ================= FILTER =================
  const filtered = yogaPractices.filter((y) => {
    const matchLevel = activeLevel === "All" || y.level === activeLevel;
    const matchCat = activeCategory === "All" || y.category === activeCategory;
    return matchLevel && matchCat;
  });

  // ================= LOADING =================
  if (loading) {
    return <div className="text-center py-20 text-lg">Loading Yoga...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <img
          src={yogaHero}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="bg-primary/20 px-4 py-1 rounded-full text-secondary mb-6 inline-block">
              🧘 Mind · Body · Spirit
            </span>
            <h1 className="text-4xl font-bold text-white">
              Yoga & <span className="text-primary">Meditation</span>
            </h1>
            <p className="text-white/70 mt-4">
              Explore yoga and meditation for better wellness.
            </p>
            <div className="flex gap-4 mt-6">
              <Link to="/programs">
                <Button>Join Programs</Button>
              </Link>
              <Link to="/specialists">
                <Button variant="outline">Find Instructor</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FILTER */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          {/* LEVEL */}
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`px-4 py-1 rounded-full ${activeLevel === level
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                  }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* CATEGORY */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1 rounded-full ${activeCategory === cat
                    ? "bg-primary text-white"
                    : "bg-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((practice, i) => (
            <motion.div
              key={practice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedYoga(practice)} // <-- click anywhere on card opens detail
            >
              <div className="w-full aspect-[4/3] overflow-hidden rounded-t-xl">
                <img
                  src={practice.image}
                  className="w-full h-full transition-transform duration-300 hover:scale-105"
                  alt={practice.title}
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{practice.title}</h3>

                  {/* CLICKABLE HEART */}
                  <button
                    className="ml-2"
                    onClick={(e) => {
                      e.stopPropagation(); // prevent opening drawer when clicking heart
                      handleSave(practice.id);
                    }}
                  >
                    <Heart
                      size={20}
                      className={`transition-colors ${savedIds.includes(practice.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                        }`}
                    />
                  </button>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  {practice.description}
                </p>
                <div className="flex gap-3 text-sm mt-3">
                  <span>
                    <Clock size={14} /> {practice.duration}
                  </span>
                  <span>
                    <Flame size={14} /> {practice.calories}
                  </span>
                  <span>
                    <Star size={14} /> {practice.rating}
                  </span>
                </div>

                <button
                  className="text-primary mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedYoga(practice);
                  }}
                >
                  View Details →
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center mt-10">No yoga found</div>
        )}
      </div>

      {/* ================= DRAWER ================= */}
      <YogaDetailDrawer
        yoga={selectedYoga}
        onClose={() => setSelectedYoga(null)}
      />
    </div>
  );
};

export default Yoga;
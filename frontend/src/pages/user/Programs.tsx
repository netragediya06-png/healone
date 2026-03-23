import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle, Users, Star, Heart,
  ArrowRight, Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import programsHero from '@/assets/programs-hero.jpg';

import { getPrograms } from '@/services/programService';

const Programs = () => {
  const [programs, setPrograms] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ================= FETCH =================
  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await getPrograms();

      const approvedPrograms = (res.data || []).filter(
        (p: any) =>
          p.status === "approved" &&
          p.isPublished === true &&
          p.isActive === true
      );

      setPrograms(approvedPrograms);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  // ================= CATEGORY =================
  const categories = [
    { id: "all", name: "All" },
    ...Array.from(
      new Map(
        programs.map((p) => [
          p.category?._id,
          {
            id: p.category?._id,
            name: p.category?.name || "General",
          },
        ])
      ).values()
    ),
  ];

  const filtered =
    filter === "all"
      ? programs
      : programs.filter((p) => p.category?._id === filter);

  return (
    <div className="min-h-screen">

      {/* HERO */}
      <section className="relative min-h-[55vh] flex items-center">
        <img
          src={programsHero}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="container mx-auto px-4 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >

            <motion.span className="inline-flex items-center gap-2 bg-green-600/20 px-4 py-1 rounded-full text-sm mb-4">
              <Heart className="h-4 w-4" />
              Transform Your Health Naturally
            </motion.span>

            <motion.h1 className="text-4xl font-bold">
              Wellness <span className="text-green-400">Programs</span>
            </motion.h1>

            <motion.p className="mt-3 text-gray-200">
              Expert-designed Ayurvedic programs with herbal kits,
              personalized guidance, and proven results.
            </motion.p>

            <motion.div className="flex gap-4 mt-6">
              <Link to="/specialists">
                <Button className="bg-green-600 hover:bg-green-700">
                  Consult Expert <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/products">
                <Button variant="outline" className="text-white border-white">
                  Shop Products
                </Button>
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-20">
        <div className="container mx-auto px-4">

          <h2 className="text-3xl font-bold text-center mb-4">
            Choose Your Program
          </h2>

          <p className="text-center text-gray-500 mb-8">
            Each program includes herbal kits, expert guidance, and proven Ayurvedic protocols.
          </p>

          {/* CATEGORY */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                size="sm"
                variant={filter === cat.id ? "default" : "outline"}
                onClick={() => setFilter(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {loading && (
            <p className="text-center py-10">Loading programs...</p>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {filtered.map((program, i) => (
              <motion.div
                key={program._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/program/${program._id}`)}
              >

                {/* IMAGE */}
                <div className="relative h-48">
                  <img
                    src={program.coverImage || "https://via.placeholder.com/400x250"}
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-green-600 text-white">
                      {program.durationDays} Days
                    </Badge>

                    <Badge variant="secondary">
                      {program.category?.name || "General"}
                    </Badge>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-5">

                  <div className="flex items-center gap-3 text-sm mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      {program.rating || 4.5}
                    </div>

                    <span className="text-gray-400">•</span>

                    <span className="flex items-center gap-1 text-gray-500">
                      <Users className="h-3 w-3" />
                      {program.totalEnrollments || 0} enrolled
                    </span>
                  </div>

                  <h3 className="font-bold text-lg">
                    {program.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {program.description}
                  </p>

                  <ul className="mt-3 space-y-1 text-sm">
                    {program.benefits?.slice(0, 4).map((f: string, index: number) => (
                      <li key={index} className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between items-center mt-5">
                    <div>
                      <p className="text-xs text-gray-500">Starting from</p>
                      <p className="text-lg font-bold text-green-600">
                        ₹{program.plans?.[0]?.price || 999}
                      </p>
                    </div>

                    <Button size="sm">
                      View Details
                    </Button>
                  </div>

                </div>
              </motion.div>
            ))}

          </div>

          {filtered.length === 0 && !loading && (
            <p className="text-center mt-10 text-gray-500">
              No programs found
            </p>
          )}

        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <Phone className="mx-auto mb-4" />
        <h2 className="text-2xl font-bold">
          Not Sure Which Program to Choose?
        </h2>
        <Link to="/specialists">
          <Button className="mt-4">
            Consult Expert
          </Button>
        </Link>
      </section>

    </div>
  );
};

export default Programs;
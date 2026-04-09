import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Leaf,
  Heart,
  Brain,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import heroBg from "@/assets/hero-bg.jpg";

// API helper
import API from "@/services/api";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [specialists, setSpecialists] = useState([]);
  const [trendingPrograms, setTrendingPrograms] = useState([]);

  useEffect(() => {
    // Featured Products
    API.get("/products?featured=true&limit=8")
      .then((res) => setFeaturedProducts(res.data))
      .catch((err) => console.error("Products error:", err));

    // Categories
    API.get("/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Categories error:", err));

    // Top Specialists
    API.get("/users/specialists/top?limit=4")
      .then((res) => setSpecialists(res.data))
      .catch((err) => console.error("Specialists error:", err));

    // Top Trending Programs
    // ⚠ Make sure backend is mounted as /api/program
     API.get("/programs/approved/top?limit=4") // <-- /programs to match backend
      .then((res) => setTrendingPrograms(res.data.data))
      .catch((err) => console.error("Programs error:", err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img
          src={heroBg}
          alt="Ayurvedic wellness"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="max-w-xl" initial="hidden" animate="visible">
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 bg-secondary/30 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm mb-4"
            >
              <Leaf className="h-3.5 w-3.5" /> Ancient Wisdom, Modern Wellness
            </motion.span>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-background leading-tight"
            >
              Discover the Healing Power of{" "}
              <span className="text-secondary">Ayurveda</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-sm sm:text-base text-background/70 mt-4 leading-relaxed max-w-md"
            >
              Explore natural remedies, wellness products, and holistic programs
              for body, mind, and spirit.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap gap-3 mt-6"
            >
              <Link to="/products">
                <Button size="default" className="gap-2 text-sm px-6">
                  Shop Products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dosha-quiz">
                <Button
                  size="default"
                  variant="outline"
                  className="gap-2 text-sm px-6 border-background/30 text-background hover:bg-background/10"
                >
                  Take Dosha Quiz
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ayurveda Benefits */}
      <section className="py-14 bg-nature">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-display font-bold">
              Why Choose <span className="text-gradient-primary">Ayurveda?</span>
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">
              Time-tested natural healing that treats the root cause, not just
              symptoms.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: "100% Natural", desc: "Pure herbs with no chemicals" },
              { icon: Heart, title: "Holistic Healing", desc: "Body, mind & spirit together" },
              { icon: Brain, title: "Ancient Wisdom", desc: "5000+ years of healing science" },
              { icon: Sparkles, title: "Personalized Care", desc: "Based on your Dosha type" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-lg p-4 text-center shadow-card hover:shadow-elevated transition-shadow border"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness Categories */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-display font-bold">
              Wellness <span className="text-gradient-primary">Categories</span>
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Find products tailored to your health needs
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {categories.slice(0, 8).map((cat) => (
              <motion.div
                key={cat._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                 to={`/products?category=${cat._id}`}
                  className="group block rounded-lg overflow-hidden relative aspect-[4/3] shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-95 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="font-display font-bold text-sm text-background drop-shadow-md">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 bg-nature">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold">
                Featured <span className="text-gradient-primary">Products</span>
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Our most loved wellness essentials
              </p>
            </div>
            <Link to="/products">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hidden sm:flex text-xs"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Trending Programs */}
       <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold">
                Trending <span className="text-gradient-primary">Programs</span>
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Most popular wellness transformations
              </p>
            </div>
            <Link to="/programs">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hidden sm:flex text-xs"
              >
                All Programs <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingPrograms.map((program, i) => (
              <motion.div
                key={program._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-lg overflow-hidden border hover:shadow-elevated transition-all group"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={program.coverImage}
                    alt={program.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold">{program.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {program.description}
                  </p>
                  {program.specialist && (
                    <div className="flex items-center gap-2 mt-3">
                      <img
                        src={
                          program.specialist.profilePhoto?.startsWith("http")
                            ? program.specialist.profilePhoto
                            : `${process.env.REACT_APP_API_URL}${program.specialist.profilePhoto}`
                        }
                        alt={program.specialist.fullName}
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                      <span className="text-sm font-medium text-primary">
                        {program.specialist.fullName}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-lg font-display font-bold text-primary">
                      ₹{program.plans[0]?.price || 0}
                    </span>
                    <Link to="/programs">
                      <Button size="sm" className="text-xs h-7 px-3">
                        Enroll Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Top Specialists */}
      <section className="py-14 bg-nature">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold">
                Our Top <span className="text-gradient-primary">Specialists</span>
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Experienced Ayurvedic practitioners
              </p>
            </div>
            <Link to="/specialists">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hidden sm:flex text-xs"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {specialists.map((doc, i) => (
              <motion.div
                key={doc._id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="bg-card rounded-lg overflow-hidden border hover:shadow-elevated transition-all group flex flex-col items-center text-center p-4"
              >
                <img
                  src={
                    doc.profilePhoto?.startsWith("http")
                      ? doc.profilePhoto
                      : `${process.env.REACT_APP_API_URL}${doc.profilePhoto}`
                  }
                  alt={doc.fullName}
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary mb-3"
                />
                <h3 className="font-display font-semibold text-sm">{doc.fullName}</h3>
                <p className="text-xs text-primary font-medium mt-1">
                  {doc.professionalDetails?.qualification || "Ayurveda Specialist"}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {doc.professionalDetails?.experienceYears || 0}+ years experience
                </p>
                <Link to="/specialists" className="w-full mt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs h-7">
                    Book Consultation
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
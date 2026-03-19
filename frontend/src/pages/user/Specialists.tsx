import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Award, MapPin, Phone, Mail, Calendar, Users, CheckCircle, Heart, ArrowRight, Video, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import API from '@/services/api';
import specialistsHero from '@/assets/specialists-hero.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const Specialists = () => {

  const [specialists, setSpecialists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const res = await API.get("/specialists?status=approved");
      setSpecialists(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

    /* ================= FORMAT DATA ================= */
  const formattedSpecialists = specialists.map((sp) => ({
    id: sp._id,
    name: sp.fullName,
    image: sp.profilePhoto,
    specialization: sp.organizationDetails?.specialization?.join(" & "),
    experience: `${sp.organizationDetails?.experienceYears || 0}+ years`,
    rating: 4.8,
    consultations: 1000,
    location: `${sp.location?.city}, ${sp.location?.state}`,
    languages: sp.languagesSpoken || [],
    education: sp.professionalDetails?.qualification || "",
    about: sp.bio,
    expertise: sp.organizationDetails?.servicesOffered || [],
    availability: sp.availability?.days?.map(
      (d: string) =>
        `${d}: ${sp.availability?.startTime}-${sp.availability?.endTime}`
    ) || [],
    consultFee: `₹${sp.organizationDetails?.pricing?.offline || 0}`,
    onlineFee: `₹${sp.organizationDetails?.pricing?.online || 0}`,
  }));

/* ================= FILTER ================= */
  const specializations = [
    'All',
    ...new Set(
      formattedSpecialists.map(s => s.specialization?.split(' & ')[0])
    )
  ];

  const filtered =
    filter === "All"
      ? formattedSpecialists
      : formattedSpecialists.filter((s) =>
          s.specialization?.includes(filter)
        );

  /* ================= BOOK ================= */
  const handleBook = (name: string, type: string) => {
    toast.success(`${type} consultation booked with ${name}!`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <img src={specialistsHero} alt="Ayurvedic consultation" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              <Award className="h-4 w-4" /> Certified Ayurvedic Experts
            </motion.span>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-display font-bold text-background leading-tight">
              Our <span className="text-primary">Specialists</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-background/70 mt-4 max-w-lg leading-relaxed">
              Consult with experienced Ayurvedic practitioners online or in-person. Get personalized treatment plans based on ancient healing wisdom.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 mt-6">
              <Button size="lg" className="gap-2" onClick={() => handleBook('', 'Free Discovery')}>Book Free Consultation <ArrowRight className="h-4 w-4" /></Button>
              <Link to="/programs"><Button size="lg" variant="outline" className="gap-2 border-background/30 text-background hover:bg-background/10">View Programs</Button></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '6', label: 'Expert Practitioners' },
              { value: '36,000+', label: 'Consultations Done' },
              { value: '4.9★', label: 'Average Rating' },
              { value: '97%', label: 'Patient Satisfaction' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl lg:text-3xl font-display font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {specializations.map(spec => (
              <Button key={spec} variant={filter === spec ? 'default' : 'outline'} size="sm" onClick={() => setFilter(spec)}>
                {spec}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((doc, i) => (
              <motion.div key={doc.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-2xl overflow-hidden border hover:shadow-elevated transition-all">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img src={doc.image} alt={doc.name} className="h-20 w-20 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-bold">{doc.name}</h3>
                      <p className="text-sm text-primary font-medium">{doc.specialization}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs">
                          <Star className="h-3 w-3 fill-accent text-accent" /> {doc.rating}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {doc.experience}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-4 line-clamp-2">{doc.about}</p>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {doc.expertise.slice(0, 3).map(e => (
                      <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                    ))}
                    {doc.expertise.length > 3 && <Badge variant="outline" className="text-xs">+{doc.expertise.length - 3}</Badge>}
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {doc.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {doc.consultations.toLocaleString()}+ patients</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">In-Person</p>
                      <p className="font-display font-bold text-primary">{doc.consultFee}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground">Online</p>
                      <p className="font-display font-bold text-primary">{doc.onlineFee}</p>
                    </div>
                  </div>

                  <Button className="w-full mt-4 gap-2" onClick={() => setSelectedDoc(selectedDoc === doc.id ? null : doc.id)}>
                    {selectedDoc === doc.id ? 'Hide Details' : 'Book Consultation'} <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* Expanded */}
                  {selectedDoc === doc.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-5 pt-5 border-t space-y-4">
                      <div>
                        <h4 className="font-display font-semibold text-sm mb-2">Education</h4>
                        <p className="text-xs text-muted-foreground">{doc.education}</p>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-sm mb-2">All Expertise</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {doc.expertise.map(e => (
                            <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-sm mb-2">Availability</h4>
                        {doc.availability.map(a => (
                          <p key={a} className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-primary" /> {a}
                          </p>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-display font-semibold text-sm mb-2">Languages</h4>
                        <p className="text-xs text-muted-foreground">{doc.languages.join(', ')}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button size="sm" className="gap-1.5" onClick={() => handleBook(doc.name, 'In-Person')}>
                          <Calendar className="h-3.5 w-3.5" /> In-Person
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => handleBook(doc.name, 'Online')}>
                          <Video className="h-3.5 w-3.5" /> Online
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Consult */}
      <section className="py-20 bg-nature">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-14">Why Consult Our <span className="text-gradient-primary">Experts?</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: 'Certified Experts', desc: 'All practitioners are BAMS/MD qualified with 10+ years experience.' },
              { icon: Video, title: 'Online & Offline', desc: 'Consult from anywhere via video call or visit in person.' },
              { icon: Heart, title: 'Personalized Care', desc: 'Every treatment plan is customized to your unique Prakriti.' },
              { icon: MessageCircle, title: 'Follow-up Support', desc: 'Get ongoing guidance and follow-up consultations.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-xl p-6 text-center border shadow-card">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-primary-foreground">Start Your Healing Journey Today</h2>
          <p className="text-primary-foreground/70 mt-3 max-w-md mx-auto">Book your first consultation and get a personalized Ayurvedic wellness plan.</p>
          <Button variant="secondary" size="lg" className="gap-2 mt-8">
            <Phone className="h-4 w-4" /> Book Free Discovery Call
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Specialists;

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Award, MapPin, Phone, Mail, Calendar, Users, CheckCircle, Heart, ArrowRight, Video, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import specialistsHero from '@/assets/specialists-hero.jpg';

import drPriya from '@/assets/specialists/dr-priya.jpg';
import drRajesh from '@/assets/specialists/dr-rajesh.jpg';
import drAnita from '@/assets/specialists/dr-anita.jpg';
import drSanjay from '@/assets/specialists/dr-sanjay.jpg';
import drKavita from '@/assets/specialists/dr-kavita.jpg';
import drVikram from '@/assets/specialists/dr-vikram.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const specialists = [
  {
    id: 'dr-priya',
    name: 'Dr. Priya Sharma',
    image: drPriya,
    specialization: 'Panchakarma & Detox Therapy',
    experience: '15+ years',
    rating: 4.9,
    consultations: 5200,
    location: 'Mumbai, India',
    languages: ['Hindi', 'English', 'Marathi'],
    education: 'BAMS, MD (Ayurveda) - Mumbai University',
    about: 'Dr. Priya is a renowned Panchakarma specialist who has helped thousands of patients achieve holistic wellness through traditional detox therapies and personalized treatment protocols.',
    expertise: ['Panchakarma Therapy', 'Detox Programs', 'Chronic Disease Management', 'Women\'s Health', 'Skin Disorders'],
    availability: ['Mon-Fri: 10AM-6PM', 'Sat: 10AM-2PM'],
    consultFee: '₹800',
    onlineFee: '₹500',
  },
  {
    id: 'dr-rajesh',
    name: 'Dr. Rajesh Gupta',
    image: drRajesh,
    specialization: 'Herbal Medicine & Rasayana',
    experience: '20+ years',
    rating: 4.9,
    consultations: 8400,
    location: 'Delhi, India',
    languages: ['Hindi', 'English', 'Sanskrit'],
    education: 'BAMS, PhD (Dravyaguna) - BHU Varanasi',
    about: 'Dr. Rajesh is one of India\'s leading experts in herbal medicine with deep knowledge of Rasayana (rejuvenation) therapies. His research on medicinal herbs has been published internationally.',
    expertise: ['Herbal Formulations', 'Rasayana Therapy', 'Immunity Enhancement', 'Digestive Disorders', 'Diabetes Management'],
    availability: ['Mon-Sat: 9AM-5PM'],
    consultFee: '₹1,200',
    onlineFee: '₹700',
  },
  {
    id: 'dr-anita',
    name: 'Dr. Anita Verma',
    image: drAnita,
    specialization: 'Yoga Therapy & Mind-Body Wellness',
    experience: '12+ years',
    rating: 4.8,
    consultations: 3600,
    location: 'Rishikesh, India',
    languages: ['Hindi', 'English'],
    education: 'BAMS, Certified Yoga Therapist - SVYASA',
    about: 'Dr. Anita combines Ayurvedic principles with therapeutic yoga to address stress, anxiety, and chronic pain. She runs popular wellness retreats in Rishikesh.',
    expertise: ['Yoga Therapy', 'Stress & Anxiety', 'Pain Management', 'Pranayama', 'Meditation Guidance'],
    availability: ['Tue-Sat: 8AM-4PM'],
    consultFee: '₹600',
    onlineFee: '₹400',
  },
  {
    id: 'dr-sanjay',
    name: 'Dr. Sanjay Patel',
    image: drSanjay,
    specialization: 'Dosha Analysis & Nadi Pariksha',
    experience: '18+ years',
    rating: 4.9,
    consultations: 6800,
    location: 'Jaipur, India',
    languages: ['Hindi', 'English', 'Gujarati'],
    education: 'BAMS, MD (Rog Nidan) - Gujarat Ayurved University',
    about: 'Dr. Sanjay specializes in traditional Nadi Pariksha (pulse diagnosis) and comprehensive Dosha analysis to create highly personalized treatment plans.',
    expertise: ['Nadi Pariksha', 'Dosha Balancing', 'Personalized Medicine', 'Joint Disorders', 'Cardiac Wellness'],
    availability: ['Mon-Fri: 9AM-6PM', 'Sat: 9AM-1PM'],
    consultFee: '₹1,000',
    onlineFee: '₹600',
  },
  {
    id: 'dr-kavita',
    name: 'Dr. Kavita Iyer',
    image: drKavita,
    specialization: 'Ayurvedic Nutrition & Diet Therapy',
    experience: '10+ years',
    rating: 4.8,
    consultations: 2900,
    location: 'Bangalore, India',
    languages: ['Hindi', 'English', 'Kannada', 'Tamil'],
    education: 'BAMS, MSc Nutrition - Manipal University',
    about: 'Dr. Kavita is a pioneer in Ayurvedic nutrition who creates personalized diet plans based on Prakriti (body constitution) analysis for optimal health outcomes.',
    expertise: ['Ayurvedic Nutrition', 'Weight Management', 'Gut Health', 'Sports Nutrition', 'Child Nutrition'],
    availability: ['Mon-Sat: 10AM-7PM'],
    consultFee: '₹700',
    onlineFee: '₹450',
  },
  {
    id: 'dr-vikram',
    name: 'Dr. Vikram Rao',
    image: drVikram,
    specialization: 'Panchakarma & Marma Therapy',
    experience: '22+ years',
    rating: 4.9,
    consultations: 9200,
    location: 'Kerala, India',
    languages: ['Hindi', 'English', 'Malayalam'],
    education: 'BAMS, MD (Kayachikitsa) - Kerala University',
    about: 'Dr. Vikram is a master practitioner of traditional Kerala Ayurveda with expertise in Marma therapy and advanced Panchakarma procedures for deep healing.',
    expertise: ['Marma Therapy', 'Kerala Panchakarma', 'Neurological Disorders', 'Spine Care', 'Rejuvenation'],
    availability: ['Mon-Fri: 8AM-5PM'],
    consultFee: '₹1,500',
    onlineFee: '₹800',
  },
];

const Specialists = () => {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const specializations = ['All', ...new Set(specialists.map(s => s.specialization.split(' & ')[0]))];
  const filtered = filter === 'All' ? specialists : specialists.filter(s => s.specialization.includes(filter));

  const handleBook = (name: string, type: string) => {
    toast.success(`${type} consultation booked with ${name}!`, {
      description: 'You will receive a confirmation email with appointment details.',
    });
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

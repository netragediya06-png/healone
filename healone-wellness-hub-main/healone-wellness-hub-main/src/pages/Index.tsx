import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Heart, Brain, Shield, Sparkles, Star, CheckCircle, Send, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products-data';
import heroBg from '@/assets/hero-bg.jpg';

// Category images
import catImmunity from '@/assets/categories/immunity.jpg';
import catDigestion from '@/assets/categories/digestion.jpg';
import catSkincare from '@/assets/categories/skincare.jpg';
import catHaircare from '@/assets/categories/haircare.jpg';
import catPainRelief from '@/assets/categories/pain-relief.jpg';
import catEnergy from '@/assets/categories/energy.jpg';
import catBrain from '@/assets/categories/brain.jpg';
import catHeart from '@/assets/categories/heart.jpg';

// Specialist images
import drPriya from '@/assets/specialists/dr-priya.jpg';
import drRajesh from '@/assets/specialists/dr-rajesh.jpg';
import drAnita from '@/assets/specialists/dr-anita.jpg';
import drSanjay from '@/assets/specialists/dr-sanjay.jpg';

// Program images
import progDetox from '@/assets/programs/detox.jpg';
import progImmunity from '@/assets/programs/immunity.jpg';
import progStress from '@/assets/programs/stress-relief.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const Index = () => {
  const featuredProducts = products.filter(p => p.badge).slice(0, 4);

  const categories = [
    { label: 'Immunity', img: catImmunity },
    { label: 'Digestion', img: catDigestion },
    { label: 'Skin Care', img: catSkincare },
    { label: 'Hair Care', img: catHaircare },
    { label: 'Pain Relief', img: catPainRelief },
    { label: 'Energy', img: catEnergy },
    { label: 'Brain Health', img: catBrain },
    { label: 'Heart Health', img: catHeart },
  ];

  const specialists = [
    { name: 'Dr. Priya Sharma', spec: 'Panchakarma Expert', exp: '15+ years', img: drPriya },
    { name: 'Dr. Rajesh Gupta', spec: 'Herbal Medicine', exp: '20+ years', img: drRajesh },
    { name: 'Dr. Anita Verma', spec: 'Yoga Therapy', exp: '12+ years', img: drAnita },
    { name: 'Dr. Sanjay Patel', spec: 'Dosha Analysis', exp: '18+ years', img: drSanjay },
  ];

  const trendingPrograms = [
    { title: '21-Day Detox', desc: 'Complete body cleanse with herbal juices & yoga.', duration: '21 Days', price: '₹2,999', img: progDetox, features: ['Personalized diet plan', 'Daily yoga sessions', 'Herbal supplement kit'] },
    { title: 'Immunity Booster', desc: 'Strengthen your natural defenses with ancient formulas.', duration: '30 Days', price: '₹3,999', img: progImmunity, features: ['Immunity herbs kit', 'Breathing exercises', 'Weekly expert calls'] },
    { title: 'Stress Relief', desc: 'Achieve mental peace through meditation & herbs.', duration: '14 Days', price: '₹1,999', img: progStress, features: ['Ashwagandha supplements', 'Guided meditation', 'Sleep optimization'] },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img src={heroBg} alt="Ayurvedic wellness" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="max-w-xl" initial="hidden" animate="visible">
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-secondary/30 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm mb-4">
              <Leaf className="h-3.5 w-3.5" /> Ancient Wisdom, Modern Wellness
            </motion.span>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-background leading-tight">
              Discover the Healing Power of <span className="text-secondary">Ayurveda</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-sm sm:text-base text-background/70 mt-4 leading-relaxed max-w-md">
              Explore natural remedies, wellness products, and holistic programs for body, mind, and spirit.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3 mt-6">
              <Link to="/products">
                <Button size="default" className="gap-2 text-sm px-6">
                  Shop Products <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dosha-quiz">
                <Button size="default" variant="outline" className="gap-2 text-sm px-6 border-background/30 text-background hover:bg-background/10">
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
            <h2 className="text-2xl lg:text-3xl font-display font-bold">Why Choose <span className="text-gradient-primary">Ayurveda?</span></h2>
            <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-sm">Time-tested natural healing that treats the root cause, not just symptoms.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: '100% Natural', desc: 'Pure herbs with no chemicals' },
              { icon: Heart, title: 'Holistic Healing', desc: 'Body, mind & spirit together' },
              { icon: Brain, title: 'Ancient Wisdom', desc: '5000+ years of healing science' },
              { icon: Sparkles, title: 'Personalized Care', desc: 'Based on your Dosha type' },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-lg p-4 text-center shadow-card hover:shadow-elevated transition-shadow border">
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
            <h2 className="text-2xl lg:text-3xl font-display font-bold">Wellness <span className="text-gradient-primary">Categories</span></h2>
            <p className="text-muted-foreground mt-2 text-sm">Find products tailored to your health needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <Link to={`/products?category=${cat.label}`} className="group block rounded-lg overflow-hidden relative aspect-[4/3] shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5">
                  <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="font-display font-bold text-sm text-background drop-shadow-md">{cat.label}</span>
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
              <h2 className="text-2xl lg:text-3xl font-display font-bold">Featured <span className="text-gradient-primary">Products</span></h2>
              <p className="text-muted-foreground mt-1 text-sm">Our most loved wellness essentials</p>
            </div>
            <Link to="/products">
              <Button variant="outline" size="sm" className="gap-2 hidden sm:flex text-xs">View All <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Wellness Programs */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold">Trending <span className="text-gradient-primary">Programs</span></h2>
              <p className="text-muted-foreground mt-1 text-sm">Most popular wellness transformations</p>
            </div>
            <Link to="/programs">
              <Button variant="outline" size="sm" className="gap-2 hidden sm:flex text-xs">All Programs <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {trendingPrograms.map((program, i) => (
              <motion.div key={program.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-lg overflow-hidden border hover:shadow-elevated transition-all group">
                <div className="relative h-36 overflow-hidden">
                  <img src={program.img} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <span className="text-[10px] font-bold text-primary-foreground bg-primary px-2 py-0.5 rounded-full">{program.duration}</span>
                    <span className="text-[10px] font-bold text-primary-foreground bg-secondary px-2 py-0.5 rounded-full flex items-center gap-1"><Flame className="h-2.5 w-2.5" /> Trending</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold">{program.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{program.desc}</p>
                  <ul className="mt-2 space-y-1">
                    {program.features.map(f => (
                      <li key={f} className="flex items-center gap-1.5 text-xs">
                        <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-lg font-display font-bold text-primary">{program.price}</span>
                    <Link to="/programs"><Button size="sm" className="text-xs h-7 px-3">Enroll Now</Button></Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dosha Quiz CTA */}
      <section className="py-12 bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-md">
              <span className="inline-flex items-center gap-2 bg-secondary/30 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Personalized Wellness
              </span>
              <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground">
                Discover Your <span className="text-accent">Dosha Type</span>
              </h2>
              <p className="text-primary-foreground/70 mt-2 text-sm leading-relaxed">
                Take our quick Ayurvedic quiz to find your unique body constitution and get personalized recommendations.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                {['2-minute quiz', 'Personalized results', 'Product recommendations'].map(t => (
                  <div key={t} className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
                    <CheckCircle className="h-3.5 w-3.5 text-accent" /> {t}
                  </div>
                ))}
              </div>
            </div>
            <Link to="/dosha-quiz">
              <Button size="lg" variant="outline" className="gap-2 text-sm px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Take the Quiz <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Specialists */}
      <section className="py-14 bg-nature">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-bold">Our Top <span className="text-gradient-primary">Specialists</span></h2>
              <p className="text-muted-foreground mt-1 text-sm">Experienced Ayurvedic practitioners</p>
            </div>
            <Link to="/specialists">
              <Button variant="outline" size="sm" className="gap-2 hidden sm:flex text-xs">View All <ArrowRight className="h-3.5 w-3.5" /></Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {specialists.map((doc, i) => (
              <motion.div key={doc.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-lg overflow-hidden border hover:shadow-elevated transition-all group">
                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-display font-semibold text-sm">{doc.name}</h3>
                  <p className="text-xs text-primary font-medium mt-0.5">{doc.spec}</p>
                  <p className="text-[10px] text-muted-foreground">{doc.exp} experience</p>
                  <Link to="/specialists">
                    <Button variant="outline" size="sm" className="mt-2 w-full text-xs h-7">Book Consultation</Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-display font-bold">What Our <span className="text-gradient-primary">Customers Say</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Meera K.', text: 'The Ashwagandha powder has completely transformed my sleep quality. I feel more energetic!', rating: 5 },
              { name: 'Arjun S.', text: 'Been using the Aloe Vera juice for 3 months. My digestion has improved dramatically!', rating: 5 },
              { name: 'Pooja R.', text: 'The 21-day detox program was life-changing. Lost 4kg and feel incredibly fresh.', rating: 5 },
            ].map((review, i) => (
              <motion.div key={review.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-lg p-4 border shadow-card">
                <div className="flex gap-0.5 mb-2">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-xs text-foreground/80 italic leading-relaxed">"{review.text}"</p>
                <p className="font-display font-semibold mt-3 text-xs">{review.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <Leaf className="h-8 w-8 mx-auto mb-3 text-accent" />
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground">
            Stay on Your Wellness Journey
          </h2>
          <p className="mt-2 max-w-md mx-auto text-sm text-primary-foreground/70">
            Get weekly Ayurvedic tips, exclusive offers, and natural remedies delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto mt-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2.5 rounded-lg text-sm bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button className="gap-2 px-5 text-sm bg-accent text-accent-foreground hover:bg-accent/90">
              Subscribe <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

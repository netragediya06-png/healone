import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Users, Star, Crown, Zap, Heart, Shield, Leaf, ArrowRight, Calendar, Phone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import programsHero from '@/assets/programs-hero.jpg';

import detoxImg from '@/assets/programs/detox.jpg';
import immunityImg from '@/assets/programs/immunity.jpg';
import stressImg from '@/assets/programs/stress-relief.jpg';
import weightImg from '@/assets/programs/weight.jpg';
import digestionImg from '@/assets/programs/digestion.jpg';
import skinImg from '@/assets/programs/skin.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const programs = [
  {
    id: 'detox-21', title: '21-Day Detox Program',
    desc: 'Complete body cleanse with herbal juices, yoga, and personalized dietary guidance for total rejuvenation.',
    image: detoxImg, duration: '21 Days', durationDays: 21, category: 'Detox', rating: 4.9, enrolled: 2340,
    features: ['Personalized Ayurvedic diet plan', 'Daily yoga & pranayama sessions', 'Herbal supplement kit included', 'Weekly video consultation', 'Detox recipe book', 'Progress tracking dashboard'],
    plans: [
      { name: 'Basic', price: 2999, period: 'one-time', features: ['Diet plan', 'Herbal kit', 'Email support'] },
      { name: 'Premium', price: 4999, period: 'one-time', features: ['Everything in Basic', 'Video consultations', 'Yoga sessions', 'Recipe book'], popular: true },
      { name: 'VIP', price: 1499, period: '/month', features: ['Everything in Premium', 'Personal coach', '24/7 support', 'Monthly herb refills'] },
    ],
  },
  {
    id: 'immunity-30', title: '30-Day Immunity Booster',
    desc: 'Strengthen your natural defenses with ancient Ayurvedic formulas, breathing exercises, and expert guidance.',
    image: immunityImg, duration: '30 Days', durationDays: 30, category: 'Immunity', rating: 4.8, enrolled: 3120,
    features: ['Immunity herbs kit (Tulsi, Giloy, Ashwagandha)', 'Breathing & pranayama exercises', 'Weekly expert video calls', 'Immunity-boosting recipes', 'Sleep optimization guide', 'Stress management techniques'],
    plans: [
      { name: 'Basic', price: 3499, period: 'one-time', features: ['Herbs kit', 'Exercise guide', 'Email support'] },
      { name: 'Premium', price: 5999, period: 'one-time', features: ['Everything in Basic', 'Weekly expert calls', 'Recipe book', 'Sleep guide'], popular: true },
      { name: 'VIP', price: 1999, period: '/month', features: ['Everything in Premium', 'Dedicated coach', 'Priority support', 'Monthly refills'] },
    ],
  },
  {
    id: 'stress-14', title: '14-Day Stress Relief',
    desc: 'Achieve mental peace through guided meditation, Ayurvedic herbs, and lifestyle changes for lasting calm.',
    image: stressImg, duration: '14 Days', durationDays: 14, category: 'Mental Wellness', rating: 4.9, enrolled: 1890,
    features: ['Ashwagandha & Brahmi supplements', 'Daily guided meditation (audio)', 'Sleep optimization protocol', 'Journaling templates', 'Yoga nidra sessions', 'Aromatherapy guide'],
    plans: [
      { name: 'Basic', price: 1999, period: 'one-time', features: ['Supplements', 'Meditation audios', 'Email support'] },
      { name: 'Premium', price: 3499, period: 'one-time', features: ['Everything in Basic', 'Yoga nidra', 'Aromatherapy kit', 'Journal'], popular: true },
      { name: 'VIP', price: 999, period: '/month', features: ['Everything in Premium', 'Live sessions', '1-on-1 coaching', 'Ongoing support'] },
    ],
  },
  {
    id: 'weight-30', title: '30-Day Weight Management',
    desc: 'Achieve healthy weight naturally with Ayurvedic metabolism boosters, diet plans, and targeted yoga sequences.',
    image: weightImg, duration: '30 Days', durationDays: 30, category: 'Weight', rating: 4.7, enrolled: 4560,
    features: ['Metabolism-boosting herbal kit', 'Calorie-optimized Ayurvedic meals', 'Fat-burning yoga sequences', 'Weekly body composition tracking', 'Detox juice recipes', 'Community support group'],
    plans: [
      { name: 'Basic', price: 3999, period: 'one-time', features: ['Herbal kit', 'Meal plan', 'Exercise guide'] },
      { name: 'Premium', price: 6999, period: 'one-time', features: ['Everything in Basic', 'Video coaching', 'Tracking app', 'Community access'], popular: true },
      { name: 'VIP', price: 2499, period: '/month', features: ['Everything in Premium', 'Personal trainer', 'Custom meals', 'Monthly kit refills'] },
    ],
  },
  {
    id: 'digestion-21', title: '21-Day Digestive Wellness',
    desc: 'Heal your gut naturally with Triphala, ginger formulas, and an Ayurvedic eating rhythm for optimal digestion.',
    image: digestionImg, duration: '21 Days', durationDays: 21, category: 'Digestion', rating: 4.8, enrolled: 2780,
    features: ['Triphala & digestive herb kit', 'Gut-healing meal plans', 'Food combining guide', 'Agni (digestive fire) practices', 'Probiotic recipes', 'Expert consultation'],
    plans: [
      { name: 'Basic', price: 2499, period: 'one-time', features: ['Herb kit', 'Meal plan', 'Guide book'] },
      { name: 'Premium', price: 4499, period: 'one-time', features: ['Everything in Basic', 'Expert calls', 'Probiotic recipes', 'Food journal'], popular: true },
      { name: 'VIP', price: 1299, period: '/month', features: ['Everything in Premium', 'Personal dietician', 'Priority support', 'Monthly refills'] },
    ],
  },
  {
    id: 'skin-28', title: '28-Day Skin Glow Program',
    desc: 'Achieve radiant skin from within using Ayurvedic herbs, face packs, detox juices, and skincare rituals.',
    image: skinImg, duration: '28 Days', durationDays: 28, category: 'Skin Care', rating: 4.9, enrolled: 3450,
    features: ['Herbal skin care kit', 'DIY face pack recipes', 'Skin-detox juice plan', 'Daily skincare ritual guide', 'Anti-aging yoga exercises', 'Nutrition for glowing skin'],
    plans: [
      { name: 'Basic', price: 2999, period: 'one-time', features: ['Skin care kit', 'Juice plan', 'Ritual guide'] },
      { name: 'Premium', price: 5499, period: 'one-time', features: ['Everything in Basic', 'Face packs', 'Yoga guide', 'Expert consultation'], popular: true },
      { name: 'VIP', price: 1799, period: '/month', features: ['Everything in Premium', 'Derma expert', 'Custom routine', 'Monthly product box'] },
    ],
  },
];

const subscriptionPlans = [
  {
    name: 'Wellness Starter', icon: Leaf, price: 999, period: '/month',
    desc: 'Perfect for beginners starting their Ayurvedic journey.',
    features: ['Access to 2 programs', 'Basic herbal kit monthly', 'Community forum access', 'Weekly wellness newsletter', 'Guided meditation library'],
    color: 'border-muted',
  },
  {
    name: 'Wellness Pro', icon: Zap, price: 2499, period: '/month',
    desc: 'For dedicated wellness seekers who want expert guidance.',
    features: ['Access to all programs', 'Premium herbal kit monthly', 'Monthly video consultation', 'Priority community access', 'Exclusive yoga sessions', 'Personalized diet plans'],
    color: 'border-primary', popular: true,
  },
  {
    name: 'Wellness Elite', icon: Crown, price: 4999, period: '/month',
    desc: 'The ultimate Ayurvedic wellness experience with VIP perks.',
    features: ['Everything in Pro', 'Weekly 1-on-1 coaching', 'Custom herbal formulations', 'Home visit consultations', 'Family member access (2)', 'Annual retreat discount (30%)', 'Exclusive product previews'],
    color: 'border-accent',
  },
];

const Programs = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...new Set(programs.map(p => p.category))];
  const filtered = filter === 'All' ? programs : programs.filter(p => p.category === filter);

  const handleEnroll = (program: typeof programs[0], plan: typeof programs[0]['plans'][0]) => {
    toast.success(`Enrolled in ${program.title} - ${plan.name} plan!`, {
      description: 'Check your profile to track progress.',
    });
  };

  const handleSubscribe = (plan: typeof subscriptionPlans[0]) => {
    toast.success(`Subscribed to ${plan.name}!`, {
      description: 'Your subscription is now active. Welcome to HealOne wellness family!',
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <img src={programsHero} alt="Wellness retreat" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.span variants={fadeUp} custom={0} className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              <Heart className="h-4 w-4" /> Transform Your Health Naturally
            </motion.span>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl lg:text-5xl font-display font-bold text-background leading-tight">
              Wellness <span className="text-primary">Programs</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-background/70 mt-4 max-w-lg leading-relaxed">
              Expert-designed Ayurvedic programs with herbal kits, personalized guidance, and proven results.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4 mt-6">
              <Link to="/specialists"><Button size="lg" className="gap-2">Consult Expert <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/products"><Button size="lg" variant="outline" className="gap-2 border-background/30 text-background hover:bg-background/10">Shop Products</Button></Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '18,000+', label: 'Members Enrolled' },
              { value: '6', label: 'Expert Programs' },
              { value: '4.8★', label: 'Average Rating' },
              { value: '92%', label: 'Success Rate' },
            ].map(s => (
              <div key={s.label}>
                <p className="text-2xl lg:text-3xl font-display font-bold text-primary">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-4">Choose Your <span className="text-gradient-primary">Program</span></h2>
          <p className="text-center text-muted-foreground mb-10">Each program includes herbal kits, expert guidance, and proven Ayurvedic protocols.</p>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map(cat => (
              <Button key={cat} variant={filter === cat ? 'default' : 'outline'} size="sm" onClick={() => setFilter(cat)}>
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((program, i) => (
              <motion.div key={program.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-card rounded-2xl overflow-hidden border hover:shadow-elevated transition-all group">
                <div className="relative h-48 overflow-hidden">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground">{program.duration}</Badge>
                    <Badge variant="secondary">{program.category}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">{program.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> {program.enrolled.toLocaleString()} enrolled
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold">{program.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{program.desc}</p>

                  <ul className="mt-4 space-y-1.5">
                    {program.features.slice(0, 4).map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div>
                      <span className="text-xs text-muted-foreground">Starting from</span>
                      <p className="text-xl font-display font-bold text-primary">₹{program.plans[0].price.toLocaleString()}</p>
                    </div>
                    <Button size="sm" className="gap-1" onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}>
                      {selectedProgram === program.id ? 'Hide Plans' : 'View Plans'} <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {selectedProgram === program.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-6 space-y-3">
                      {program.plans.map(plan => (
                        <div key={plan.name} className={`border rounded-xl p-4 ${plan.popular ? 'border-primary bg-primary/5' : ''}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-display font-bold">{plan.name}</span>
                              {plan.popular && <Badge className="ml-2 bg-primary text-primary-foreground text-xs">Popular</Badge>}
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-display font-bold text-primary">₹{plan.price.toLocaleString()}</span>
                              <span className="text-xs text-muted-foreground">{plan.period}</span>
                            </div>
                          </div>
                          <ul className="space-y-1 mb-3">
                            {plan.features.map(f => (
                              <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                <CheckCircle className="h-3 w-3 text-primary shrink-0" /> {f}
                              </li>
                            ))}
                          </ul>
                          <Button size="sm" variant={plan.popular ? 'default' : 'outline'} className="w-full"
                            onClick={() => handleEnroll(program, plan)}>
                            {plan.period === '/month' ? 'Subscribe Now' : 'Enroll Now'}
                          </Button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="py-20 bg-nature">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <Crown className="h-4 w-4" /> All-Access Plans
            </span>
            <h2 className="text-3xl font-display font-bold">Monthly <span className="text-gradient-primary">Subscription</span> Plans</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Get unlimited access to all programs, expert consultations, and monthly herbal kits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, i) => {
              const Icon = plan.icon;
              return (
                <motion.div key={plan.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className={`bg-card rounded-2xl border-2 ${plan.color} p-8 relative ${plan.popular ? 'shadow-elevated scale-105' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground shadow-md">Most Popular</Badge>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${plan.popular ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-xl font-bold">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{plan.desc}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-display font-bold text-primary">₹{plan.price.toLocaleString()}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2.5 mb-8">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={plan.popular ? 'default' : 'outline'} size="lg"
                    onClick={() => handleSubscribe(plan)}>
                    Get Started
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary to-primary/10 rounded-3xl p-12 max-w-3xl mx-auto">
            <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl lg:text-3xl font-display font-bold mb-3">Not Sure Which Program to Choose?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">Talk to our wellness experts for a free consultation and get a personalized recommendation.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/specialists"><Button size="lg" className="gap-2">Book Free Consultation <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/dosha-quiz"><Button size="lg" variant="outline" className="gap-2">Take Dosha Quiz <Sparkles className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;

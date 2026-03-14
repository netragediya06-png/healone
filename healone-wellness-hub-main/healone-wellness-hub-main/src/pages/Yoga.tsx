import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Flame, Heart, Play, Star, ArrowRight, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import yogaHero from '@/assets/yoga-hero.jpg';

import treePose from '@/assets/yoga/tree-pose.jpg';
import warriorPose from '@/assets/yoga/warrior-pose.jpg';
import meditation from '@/assets/yoga/meditation.jpg';
import cobraPose from '@/assets/yoga/cobra-pose.jpg';
import downwardDog from '@/assets/yoga/downward-dog.jpg';
import pranayama from '@/assets/yoga/pranayama.jpg';

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const categories = ['All', 'Asanas', 'Pranayama', 'Meditation', 'Sequences'];

const yogaPractices = [
  {
    id: '1', title: 'Vrikshasana (Tree Pose)', image: treePose,
    category: 'Asanas', level: 'Beginner', duration: '5 min', calories: '20',
    description: 'A grounding balance pose that strengthens legs, opens hips, and improves focus and concentration.',
    benefits: ['Improves balance', 'Strengthens legs & core', 'Opens hip joints', 'Enhances focus'],
    steps: ['Stand tall with feet together', 'Shift weight to left foot', 'Place right foot on inner left thigh', 'Bring hands to prayer at heart or overhead', 'Hold for 30-60 seconds, switch sides'],
    contraindications: 'Avoid with ankle or knee injuries. Use wall support if needed.',
    rating: 4.8,
  },
  {
    id: '2', title: 'Virabhadrasana (Warrior Pose)', image: warriorPose,
    category: 'Asanas', level: 'Beginner', duration: '10 min', calories: '50',
    description: 'A powerful standing pose that builds strength, stamina, and confidence while stretching the chest and lungs.',
    benefits: ['Builds leg strength', 'Stretches chest & shoulders', 'Increases stamina', 'Builds confidence'],
    steps: ['Step feet 4 feet apart', 'Turn right foot 90°, left foot slightly in', 'Bend right knee over ankle', 'Extend arms parallel to floor', 'Gaze over right hand, hold 30 sec'],
    contraindications: 'High blood pressure (avoid arms overhead). Knee issues (don\'t bend past 90°).',
    rating: 4.9,
  },
  {
    id: '3', title: 'Guided Morning Meditation', image: meditation,
    category: 'Meditation', level: 'Beginner', duration: '15 min', calories: '10',
    description: 'A calming guided meditation to start your day with intention, clarity, and inner peace. Perfect for beginners.',
    benefits: ['Reduces stress & anxiety', 'Improves mental clarity', 'Sets positive intention', 'Enhances self-awareness'],
    steps: ['Sit comfortably with spine straight', 'Close eyes and take 5 deep breaths', 'Scan body from head to toe', 'Focus on natural breath rhythm', 'Set an intention for the day'],
    contraindications: 'None. Suitable for everyone.',
    rating: 4.9,
  },
  {
    id: '4', title: 'Bhujangasana (Cobra Pose)', image: cobraPose,
    category: 'Asanas', level: 'Intermediate', duration: '5 min', calories: '25',
    description: 'A gentle backbend that opens the chest, strengthens the spine, and stimulates abdominal organs for better digestion.',
    benefits: ['Strengthens spine', 'Opens chest & lungs', 'Improves digestion', 'Relieves stress & fatigue'],
    steps: ['Lie face down, palms under shoulders', 'Press into hands, lift chest off floor', 'Keep elbows slightly bent', 'Draw shoulders back and down', 'Hold for 15-30 seconds'],
    contraindications: 'Avoid during pregnancy. Not recommended for severe back injuries.',
    rating: 4.7,
  },
  {
    id: '5', title: 'Adho Mukha Svanasana (Downward Dog)', image: downwardDog,
    category: 'Asanas', level: 'Beginner', duration: '5 min', calories: '30',
    description: 'The quintessential yoga pose that energizes the body, stretches the entire back chain, and calms the nervous system.',
    benefits: ['Full body stretch', 'Strengthens arms & legs', 'Calms nervous system', 'Improves blood flow to brain'],
    steps: ['Start on hands and knees', 'Tuck toes, lift hips up and back', 'Press hands firmly, straighten arms', 'Let head hang between arms', 'Pedal feet to warm up hamstrings'],
    contraindications: 'Avoid with carpal tunnel syndrome or late pregnancy.',
    rating: 4.8,
  },
  {
    id: '6', title: 'Pranayama Breathing Session', image: pranayama,
    category: 'Pranayama', level: 'Beginner', duration: '20 min', calories: '15',
    description: 'Learn three essential breathing techniques: Anulom Vilom, Kapalbhati, and Bhramari for complete respiratory wellness.',
    benefits: ['Increases lung capacity', 'Balances nervous system', 'Reduces anxiety', 'Improves oxygen supply'],
    steps: ['Sit in comfortable position', 'Start with 5 min Anulom Vilom (alternate nostril breathing)', 'Follow with 5 min Kapalbhati (skull shining breath)', 'Finish with 5 min Bhramari (bee breathing)', 'Rest in silence for 5 min'],
    contraindications: 'Kapalbhati: avoid during pregnancy, high BP, heart conditions.',
    rating: 4.9,
  },
  {
    id: '7', title: 'Sun Salutation (Surya Namaskar)', image: warriorPose,
    category: 'Sequences', level: 'Intermediate', duration: '15 min', calories: '100',
    description: 'A dynamic 12-pose sequence that warms the body, builds strength, and creates a moving meditation when performed with breath.',
    benefits: ['Full body workout', 'Improves flexibility', 'Boosts cardiovascular health', 'Creates mental focus'],
    steps: ['Mountain Pose → Raised Arms', 'Forward Fold → Lunge', 'Plank → Chaturanga', 'Upward Dog → Downward Dog', 'Lunge → Forward Fold → Mountain'],
    contraindications: 'High BP, back injuries. Modify poses as needed.',
    rating: 5.0,
  },
  {
    id: '8', title: 'Evening Wind-Down Meditation', image: meditation,
    category: 'Meditation', level: 'Beginner', duration: '20 min', calories: '10',
    description: 'A soothing guided meditation for releasing the day\'s tension and preparing for restful sleep.',
    benefits: ['Promotes deep sleep', 'Releases tension', 'Calms racing thoughts', 'Lowers cortisol'],
    steps: ['Lie down or sit comfortably', 'Progressive muscle relaxation', 'Guided body scan', 'Visualization of peaceful scene', 'Gradual transition to sleep readiness'],
    contraindications: 'None.',
    rating: 4.8,
  },
  {
    id: '9', title: 'Yoga for Back Pain Relief', image: cobraPose,
    category: 'Sequences', level: 'Beginner', duration: '25 min', calories: '40',
    description: 'A gentle therapeutic sequence designed to relieve lower back pain, improve spinal mobility, and strengthen core muscles.',
    benefits: ['Relieves back pain', 'Improves posture', 'Strengthens core', 'Increases spinal flexibility'],
    steps: ['Cat-Cow stretches (2 min)', 'Child\'s Pose (2 min)', 'Sphinx Pose (1 min)', 'Supine twist each side', 'Bridge Pose (3 sets)'],
    contraindications: 'Herniated disc: consult doctor first.',
    rating: 4.9,
  },
];

const Yoga = () => {
  const [activeLevel, setActiveLevel] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = yogaPractices.filter(y => {
    const matchLevel = activeLevel === 'All' || y.level === activeLevel;
    const matchCat = activeCategory === 'All' || y.category === activeCategory;
    return matchLevel && matchCat;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <img src={yogaHero} alt="Yoga at sunrise" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              🧘 Mind · Body · Spirit
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-background leading-tight">
              Yoga & <span className="text-primary">Meditation</span>
            </h1>
            <p className="text-lg text-background/70 mt-4 max-w-lg leading-relaxed">
              Explore traditional yoga asanas, pranayama breathing techniques, and guided meditations for holistic wellness.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/programs"><Button size="lg" className="gap-2">Join Programs <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/specialists"><Button size="lg" variant="outline" className="gap-2 border-background/30 text-background hover:bg-background/10">Find Instructor</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground mr-2"><Filter className="h-4 w-4" /> Level:</span>
            {levels.map(level => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeLevel === level ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/70 hover:bg-secondary/80'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground mr-2">Type:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/70 hover:bg-secondary/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((practice, i) => (
            <motion.div
              key={practice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border overflow-hidden hover:shadow-elevated transition-all group"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={practice.image} alt={practice.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="flex gap-2">
                    <span className="bg-background/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full">{practice.level}</span>
                    <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">{practice.category}</span>
                  </div>
                  <button className="bg-primary text-primary-foreground h-10 w-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play className="h-4 w-4 ml-0.5" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{practice.duration}</span>
                  <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5" />{practice.calories} cal</span>
                  <span className="flex items-center gap-1 ml-auto"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{practice.rating}</span>
                </div>
                <h3 className="font-display font-bold text-lg">{practice.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{practice.description}</p>

                {expandedId === practice.id ? (
                  <div className="mt-4 space-y-4 animate-fade-in">
                    <div>
                      <h4 className="text-sm font-semibold mb-1.5 flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-primary" /> Benefits</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {practice.benefits.map(b => <li key={b}>• {b}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1.5">📋 Steps</h4>
                      <ol className="text-sm text-muted-foreground space-y-1.5">
                        {practice.steps.map((s, idx) => <li key={idx} className="flex gap-2"><span className="text-primary font-bold shrink-0">{idx + 1}.</span>{s}</li>)}
                      </ol>
                    </div>
                    <div className="bg-destructive/5 rounded-lg p-3">
                      <h4 className="text-sm font-semibold text-destructive mb-1">⚠️ Cautions</h4>
                      <p className="text-xs text-muted-foreground">{practice.contraindications}</p>
                    </div>
                    <button onClick={() => setExpandedId(null)} className="text-sm text-primary font-medium hover:underline">Show Less</button>
                  </div>
                ) : (
                  <button onClick={() => setExpandedId(practice.id)} className="mt-3 flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p className="font-display text-lg">No practices found for this filter</p>
          </div>
        )}

        {/* Schedule CTA */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-primary/10 to-secondary rounded-2xl p-8 lg:p-12">
            <h2 className="text-2xl font-display font-bold mb-3">Daily Yoga Schedule</h2>
            <div className="space-y-3 mt-6">
              {[
                { time: '6:00 AM', name: 'Sun Salutation & Warm Up', level: 'All Levels' },
                { time: '7:00 AM', name: 'Pranayama & Breathing', level: 'Beginner' },
                { time: '8:00 AM', name: 'Power Yoga Flow', level: 'Intermediate' },
                { time: '5:00 PM', name: 'Gentle Stretch & Restore', level: 'Beginner' },
                { time: '7:00 PM', name: 'Evening Meditation', level: 'All Levels' },
              ].map(s => (
                <div key={s.time} className="flex items-center gap-4 bg-background/80 rounded-lg p-3">
                  <span className="text-sm font-bold text-primary w-20">{s.time}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-accent/10 to-secondary rounded-2xl p-8 lg:p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-display font-bold mb-3">Join Live Yoga Classes</h2>
            <p className="text-muted-foreground mb-6">Connect with certified Ayurvedic yoga instructors for personalized guidance and live interactive sessions.</p>
            <ul className="space-y-2 mb-6">
              {['Live interactive sessions', 'Personalized corrections', 'Small group classes (max 15)', 'Certificate on completion'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm"><Heart className="h-4 w-4 text-primary shrink-0" />{f}</li>
              ))}
            </ul>
            <Link to="/contact"><Button size="lg" className="gap-2 w-fit">Book a Class <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Yoga;

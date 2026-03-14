import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Leaf, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import doshaHero from '@/assets/dosha-quiz-hero.jpg';

type Dosha = 'vata' | 'pitta' | 'kapha';

interface Question {
  question: string;
  options: { label: string; dosha: Dosha }[];
}

const questions: Question[] = [
  {
    question: 'What is your body frame like?',
    options: [
      { label: 'Thin, light, and lean with prominent joints', dosha: 'vata' },
      { label: 'Medium build, athletic and muscular', dosha: 'pitta' },
      { label: 'Broad, sturdy, and tends to gain weight easily', dosha: 'kapha' },
    ],
  },
  {
    question: 'How is your skin type?',
    options: [
      { label: 'Dry, rough, and tends to crack', dosha: 'vata' },
      { label: 'Sensitive, warm, and prone to redness or acne', dosha: 'pitta' },
      { label: 'Oily, smooth, and thick', dosha: 'kapha' },
    ],
  },
  {
    question: 'How do you handle stress?',
    options: [
      { label: 'I become anxious, worried, and restless', dosha: 'vata' },
      { label: 'I get irritated, frustrated, and confrontational', dosha: 'pitta' },
      { label: 'I withdraw, become lethargic, and comfort-eat', dosha: 'kapha' },
    ],
  },
  {
    question: 'What is your sleep pattern like?',
    options: [
      { label: 'Light sleeper, wake up often, hard to fall asleep', dosha: 'vata' },
      { label: 'Moderate sleeper, can fall asleep but wake early', dosha: 'pitta' },
      { label: 'Deep, heavy sleeper and hard to wake up', dosha: 'kapha' },
    ],
  },
  {
    question: 'How is your digestion?',
    options: [
      { label: 'Irregular — sometimes good, sometimes bloated', dosha: 'vata' },
      { label: 'Strong — I feel very hungry and can digest quickly', dosha: 'pitta' },
      { label: 'Slow — I feel full for a long time after meals', dosha: 'kapha' },
    ],
  },
  {
    question: 'What is your energy pattern throughout the day?',
    options: [
      { label: 'Bursts of energy followed by fatigue', dosha: 'vata' },
      { label: 'Sustained energy but crash in the afternoon', dosha: 'pitta' },
      { label: 'Steady but slow to start in the morning', dosha: 'kapha' },
    ],
  },
  {
    question: 'How would you describe your personality?',
    options: [
      { label: 'Creative, quick-thinking, enthusiastic but changeable', dosha: 'vata' },
      { label: 'Ambitious, focused, competitive, and a natural leader', dosha: 'pitta' },
      { label: 'Calm, patient, nurturing, and loyal', dosha: 'kapha' },
    ],
  },
  {
    question: 'What is your appetite like?',
    options: [
      { label: 'Variable — sometimes ravenous, sometimes not hungry', dosha: 'vata' },
      { label: 'Strong — I get "hangry" if I miss a meal', dosha: 'pitta' },
      { label: 'Moderate — I can skip meals without issues', dosha: 'kapha' },
    ],
  },
  {
    question: 'How do you react to cold weather?',
    options: [
      { label: 'I hate cold — my hands and feet are always cold', dosha: 'vata' },
      { label: 'I tolerate cold well and prefer cooler weather', dosha: 'pitta' },
      { label: 'Cold and damp weather makes me feel sluggish', dosha: 'kapha' },
    ],
  },
  {
    question: 'What describes your hair best?',
    options: [
      { label: 'Dry, thin, frizzy, and prone to split ends', dosha: 'vata' },
      { label: 'Fine, straight, and may thin or gray early', dosha: 'pitta' },
      { label: 'Thick, wavy, oily, and lustrous', dosha: 'kapha' },
    ],
  },
];

const doshaInfo: Record<Dosha, { title: string; emoji: string; color: string; description: string; traits: string[]; tips: string[] }> = {
  vata: {
    title: 'Vata — The Wind Element',
    emoji: '🌬️',
    color: 'from-blue-500 to-purple-500',
    description: 'Vata types are creative, energetic, and quick-thinking. Governed by air and space, you thrive with routine, warmth, and grounding practices.',
    traits: ['Creative & imaginative', 'Quick learner', 'Flexible & agile', 'Enthusiastic'],
    tips: ['Eat warm, nourishing foods', 'Maintain a regular routine', 'Practice grounding yoga poses', 'Stay warm and hydrated', 'Try Ashwagandha for balance'],
  },
  pitta: {
    title: 'Pitta — The Fire Element',
    emoji: '🔥',
    color: 'from-orange-500 to-red-500',
    description: 'Pitta types are ambitious, focused, and sharp-minded. Governed by fire and water, you benefit from cooling practices and moderation.',
    traits: ['Natural leader', 'Sharp intellect', 'Strong digestion', 'Goal-oriented'],
    tips: ['Favor cooling foods like cucumber and mint', 'Avoid excessive heat and spice', 'Practice calming meditation', 'Channel competitive energy positively', 'Try Shatavari for balance'],
  },
  kapha: {
    title: 'Kapha — The Earth Element',
    emoji: '🌍',
    color: 'from-green-500 to-teal-500',
    description: 'Kapha types are calm, loyal, and strong. Governed by earth and water, you thrive with stimulation, movement, and lighter foods.',
    traits: ['Patient & steady', 'Strong endurance', 'Compassionate', 'Great memory'],
    tips: ['Eat light, warm, and spicy foods', 'Stay physically active daily', 'Wake up early and avoid napping', 'Try new experiences regularly', 'Try Triphala for balance'],
  },
};

const DoshaQuiz = () => {
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Dosha[]>([]);
  const [result, setResult] = useState<Dosha | null>(null);

  const handleAnswer = (dosha: Dosha) => {
    const newAnswers = [...answers, dosha];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const counts: Record<Dosha, number> = { vata: 0, pitta: 0, kapha: 0 };
      newAnswers.forEach(d => counts[d]++);
      const dominant = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as Dosha;
      setResult(dominant);
      setStep('result');
    }
  };

  const goBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const restart = () => {
    setStep('intro');
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <img src={doshaHero} alt="Dosha Quiz" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4" /> Discover Your Constitution
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-background leading-tight">
              Ayurvedic <span className="text-primary">Dosha Quiz</span>
            </h1>
            <p className="text-lg text-background/70 mt-4 max-w-lg leading-relaxed">
              Answer 10 simple questions to discover your unique mind-body constitution and get personalized wellness recommendations.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto text-center">
              <div className="grid grid-cols-3 gap-4 mb-10">
                {(['vata', 'pitta', 'kapha'] as Dosha[]).map(d => (
                  <div key={d} className="bg-card rounded-xl border p-6 text-center">
                    <span className="text-4xl">{doshaInfo[d].emoji}</span>
                    <h3 className="font-display font-bold mt-3 capitalize">{d}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{d === 'vata' ? 'Air + Space' : d === 'pitta' ? 'Fire + Water' : 'Earth + Water'}</p>
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => setStep('quiz')} className="gap-2">
                Start Quiz <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div key={`q-${currentQ}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span>{Math.round(((currentQ + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-8">
                <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
              </div>

              <h2 className="text-2xl font-display font-bold mb-6">{questions[currentQ].question}</h2>
              <div className="space-y-3">
                {questions[currentQ].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt.dosha)}
                    className="w-full text-left p-4 rounded-xl border bg-card hover:border-primary hover:shadow-soft transition-all duration-200 group"
                  >
                    <span className="text-sm group-hover:text-primary transition-colors">{opt.label}</span>
                  </button>
                ))}
              </div>
              {currentQ > 0 && (
                <Button variant="ghost" onClick={goBack} className="mt-6 gap-2">
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Button>
              )}
            </motion.div>
          )}

          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center">
              <div className="text-6xl mb-4">{doshaInfo[result].emoji}</div>
              <h2 className="text-3xl font-display font-bold mb-2">{doshaInfo[result].title}</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">{doshaInfo[result].description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-left">
                <div className="bg-card rounded-xl border p-6">
                  <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Key Traits</h3>
                  <ul className="space-y-2">
                    {doshaInfo[result].traits.map((t, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary shrink-0" /> {t}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-card rounded-xl border p-6">
                  <h3 className="font-display font-semibold mb-3 flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" /> Wellness Tips</h3>
                  <ul className="space-y-2">
                    {doshaInfo[result].tips.map((t, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-primary shrink-0" /> {t}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Button size="lg" variant="outline" onClick={restart}>Retake Quiz</Button>
                <Link to="/products"><Button size="lg" variant="outline" className="gap-2">Shop Recommended <ArrowRight className="h-4 w-4" /></Button></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoshaQuiz;

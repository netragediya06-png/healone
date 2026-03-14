import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Leaf, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import remediesHero from '@/assets/remedies-hero.jpg';
import { remedies, remedyCategories, Remedy } from '@/lib/remedies-data';
import RemedyCard from '@/components/RemedyCard';
import RemedyDetailSheet from '@/components/RemedyDetailSheet';

const Remedies = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRemedy, setSelectedRemedy] = useState<Remedy | null>(null);

  const filtered = remedies.filter(r => {
    const matchCat = activeCategory === 'all' || r.category === activeCategory;
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <img src={remediesHero} alt="Ayurvedic remedies" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/30" />
        <div className="container mx-auto px-4 relative z-10 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm mb-6">
              <Leaf className="h-4 w-4" /> Ancient Wisdom, Modern Wellness
            </span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-background leading-tight">
              Natural Ayurvedic <span className="text-primary">Remedies</span>
            </h1>
            <p className="text-lg text-background/70 mt-4 max-w-lg leading-relaxed">
              Discover time-tested Ayurvedic remedies curated by expert specialists. Save, share, and download your favorites.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to="/products"><Button size="lg" className="gap-2">Shop Herbs <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/specialists"><Button size="lg" variant="outline" className="gap-2 border-background/30 text-background hover:bg-background/10">Consult Expert</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search remedies by name, tag, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {remedyCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-secondary text-foreground/70 hover:bg-secondary/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Remedies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((remedy, i) => (
            <RemedyCard
              key={remedy.id}
              remedy={remedy}
              index={i}
              onViewDetail={setSelectedRemedy}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Leaf className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="font-display text-lg">No remedies found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary/10 via-secondary to-primary/10 rounded-2xl p-12">
          <h2 className="text-2xl lg:text-3xl font-display font-bold mb-3">Need Personalized Remedies?</h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">Consult our Ayurvedic specialists for remedies tailored to your unique body constitution (Prakriti).</p>
          <Link to="/contact"><Button size="lg" className="gap-2">Consult a Specialist <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </div>

      {/* Detail Sheet */}
      <RemedyDetailSheet
        remedy={selectedRemedy}
        onClose={() => setSelectedRemedy(null)}
      />
    </div>
  );
};

export default Remedies;

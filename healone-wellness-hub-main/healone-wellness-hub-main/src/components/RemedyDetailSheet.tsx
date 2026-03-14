import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Heart, Share2, Download, Bookmark, BookmarkCheck,
  Clock, ChefHat, Leaf, AlertTriangle, CheckCircle2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Remedy } from '@/lib/remedies-data';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface RemedyDetailSheetProps {
  remedy: Remedy | null;
  onClose: () => void;
}

const RemedyDetailSheet = ({ remedy, onClose }: RemedyDetailSheetProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Remedy removed from saved' : 'Remedy saved!');
  };

  const handleShare = async () => {
    if (!remedy) return;
    if (navigator.share) {
      await navigator.share({
        title: remedy.title,
        text: remedy.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(
        `${remedy.title}\n\n${remedy.description}\n\nIngredients: ${remedy.ingredients.map(i => i.name).join(', ')}`
      );
      toast.success('Remedy details copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (!remedy) return;
    const content = `
${remedy.title}
${'='.repeat(remedy.title.length)}
${remedy.subtitle}

By: ${remedy.specialist.name} — ${remedy.specialist.title}

DESCRIPTION
${remedy.description}

INGREDIENTS
${remedy.ingredients.map(i => `• ${i.name} (${i.quantity}) — ${i.purpose}`).join('\n')}

STEP-BY-STEP PREPARATION
${remedy.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

BENEFITS
${remedy.benefits.map(b => `✓ ${b}`).join('\n')}

PRECAUTIONS
${remedy.precautions.map(p => `⚠ ${p}`).join('\n')}

Best Time: ${remedy.bestTimeToUse}
Dosha Affinity: ${remedy.doshaAffinity.join(', ')}
Difficulty: ${remedy.difficulty} | Duration: ${remedy.duration}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${remedy.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Remedy downloaded!');
  };

  return (
    <AnimatePresence>
      {remedy && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background z-50 shadow-2xl flex flex-col"
          >
            <div className="relative h-56 sm:h-64 shrink-0">
              <img src={remedy.image} alt={remedy.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

              <button onClick={onClose} className="absolute top-4 right-4 bg-background/20 backdrop-blur-md text-background rounded-full p-2 hover:bg-background/40 transition-colors">
                <X className="h-5 w-5" />
              </button>

              <div className="absolute top-4 left-4 flex gap-2">
                <button onClick={toggleSave} className="bg-background/20 backdrop-blur-md text-background rounded-full p-2 hover:bg-background/40 transition-colors">
                  {isSaved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
                </button>
                <button onClick={handleShare} className="bg-background/20 backdrop-blur-md text-background rounded-full p-2 hover:bg-background/40 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button onClick={handleDownload} className="bg-background/20 backdrop-blur-md text-background rounded-full p-2 hover:bg-background/40 transition-colors">
                  <Download className="h-5 w-5" />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {remedy.duration}
                  </span>
                  <span className="bg-background/90 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ChefHat className="h-3 w-3" /> {remedy.difficulty}
                  </span>
                  {remedy.doshaAffinity.map(d => (
                    <span key={d} className="bg-secondary/80 backdrop-blur-sm text-secondary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-background leading-tight">
                  {remedy.title}
                </h2>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                <div className="flex items-center gap-3 bg-card rounded-xl p-4 border">
                  <img src={remedy.specialist.image} alt={remedy.specialist.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/30" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{remedy.specialist.name}</p>
                    <p className="text-xs text-muted-foreground">{remedy.specialist.title}</p>
                  </div>
                  <Link to="/specialists">
                    <Button variant="outline" size="sm" className="text-xs">View Profile</Button>
                  </Link>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{remedy.description}</p>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-display font-bold text-base mb-4">
                    <Leaf className="h-5 w-5 text-primary" /> Ingredients
                  </h3>
                  <div className="space-y-2">
                    {remedy.ingredients.map((ing, i) => (
                      <div key={i} className="flex items-start gap-3 bg-card rounded-lg p-3 border">
                        <span className="bg-primary/10 text-primary font-bold text-xs rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-sm">{ing.name}</span>
                            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full shrink-0">{ing.quantity}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{ing.purpose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-display font-bold text-base mb-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" /> Step-by-Step Preparation
                  </h3>
                  <div className="space-y-3">
                    {remedy.steps.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="bg-primary text-primary-foreground font-bold text-xs rounded-full w-7 h-7 flex items-center justify-center shrink-0">{i + 1}</span>
                          {i < remedy.steps.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pb-2">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-display font-bold text-base mb-4">
                    <Sparkles className="h-5 w-5 text-primary" /> Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {remedy.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2 bg-primary/5 rounded-lg p-3">
                        <Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 font-display font-bold text-base mb-4">
                    <AlertTriangle className="h-5 w-5 text-destructive" /> Precautions & Warnings
                  </h3>
                  <div className="bg-destructive/5 rounded-xl p-4 space-y-2 border border-destructive/20">
                    {remedy.precautions.map((precaution, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-destructive text-xs mt-1">⚠</span>
                        <p className="text-sm text-muted-foreground">{precaution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card rounded-xl p-4 border space-y-3">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Best Time to Use</span>
                    <p className="text-sm font-medium mt-1">{remedy.bestTimeToUse}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tags</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {remedy.tags.map(tag => (
                        <span key={tag} className="bg-secondary text-secondary-foreground text-xs px-2.5 py-1 rounded-full">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/10 rounded-xl p-6 text-center">
                  <p className="font-display font-bold text-base mb-2">Need personalized guidance?</p>
                  <p className="text-sm text-muted-foreground mb-4">Consult {remedy.specialist.name} for remedies tailored to your constitution.</p>
                  <Link to="/specialists">
                    <Button size="sm" className="gap-2">Book Consultation</Button>
                  </Link>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RemedyDetailSheet;

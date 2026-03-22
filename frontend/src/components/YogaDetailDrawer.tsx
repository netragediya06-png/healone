import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Share2, Download, Bookmark, BookmarkCheck, Clock, Flame, Star, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface YogaDetailDrawerProps {
  yoga: any | null;
  onClose: () => void;
}

const YogaDetailDrawer = ({ yoga, onClose }: YogaDetailDrawerProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Yoga removed from saved" : "Yoga saved!");
  };

  const handleShare = async () => {
    if (!yoga) return;
    if (navigator.share) {
      await navigator.share({
        title: yoga.title,
        text: yoga.description,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(
        `${yoga.title}\n\n${yoga.description}\n\nBenefits: ${yoga.benefits?.join(", ")}`
      );
      toast.success("Yoga details copied to clipboard!");
    }
  };

  const handleDownload = () => {
    if (!yoga) return;
    const content = `
${yoga.title}
${"=".repeat(yoga.title.length)}

DESCRIPTION
${yoga.description}

BENEFITS
${yoga.benefits?.map((b: string) => `✓ ${b}`).join("\n")}

STEPS
${yoga.steps?.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}

CONTRAINDICATIONS
${yoga.contraindications || "None"}

LEVEL: ${yoga.level} | Duration: ${yoga.duration} | Calories: ${yoga.calories} | Rating: ${yoga.rating}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${yoga.title.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Yoga details downloaded!");
  };

  return (
    <AnimatePresence>
      {yoga && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background z-50 shadow-2xl flex flex-col"
          >
            {/* IMAGE & HEADER */}
            <div className="relative h-56 sm:h-64 shrink-0">
              <img src={yoga.image} alt={yoga.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-background/20 backdrop-blur-md text-background rounded-full p-2 hover:bg-background/40 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute top-4 left-4 flex gap-2">
                <button
                  onClick={toggleSave}
                  className="bg-background/20 backdrop-blur-md text-background rounded-full p-2 hover:bg-background/40 transition-colors"
                >
                  {isSaved ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
                </button>
                <button
                  onClick={handleShare}
                  className="bg-background/20 backdrop-blur-md text-background rounded-full p-2 hover:bg-background/40 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-background/20 backdrop-blur-md text-background rounded-full p-2 hover:bg-background/40 transition-colors"
                >
                  <Download className="h-5 w-5" />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-2 mb-2">
                  <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {yoga.duration}
                  </span>
                  <span className="bg-background/90 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Flame className="h-3 w-3" /> {yoga.calories}
                  </span>
                  <span className="bg-background/90 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" /> {yoga.rating}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-background leading-tight">
                  {yoga.title}
                </h2>
              </div>
            </div>

            {/* SCROLL CONTENT */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* DESCRIPTION */}
                <p className="text-sm text-muted-foreground leading-relaxed">{yoga.description}</p>

                {/* BENEFITS */}
                <div>
                  <h3 className="flex items-center gap-2 font-display font-bold text-base mb-4">
                    <Sparkles className="h-5 w-5 text-primary" /> Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {yoga.benefits?.map((b: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 bg-primary/5 rounded-lg p-3">
                        <Heart className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* STEPS */}
                <div>
                  <h3 className="flex items-center gap-2 font-display font-bold text-base mb-4">
                    <CheckCircle2 className="h-5 w-5 text-primary" /> Steps
                  </h3>
                  <div className="space-y-3">
                    {yoga.steps?.map((s: string, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <span className="bg-primary text-primary-foreground font-bold text-xs rounded-full w-7 h-7 flex items-center justify-center shrink-0">{i + 1}</span>
                          {i < yoga.steps.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pb-2">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONTRAINDICATIONS */}
                <div>
                  <h3 className="flex items-center gap-2 font-display font-bold text-base mb-4">
                    <AlertTriangle className="h-5 w-5 text-destructive" /> Contraindications
                  </h3>
                  <div className="bg-destructive/5 rounded-xl p-4 space-y-2 border border-destructive/20">
                    <p className="text-sm text-muted-foreground">{yoga.contraindications || "None"}</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/10 rounded-xl p-6 text-center">
                  <p className="font-display font-bold text-base mb-2">Need guidance?</p>
                  <p className="text-sm text-muted-foreground mb-4">Consult a specialist for personalized yoga guidance.</p>
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

export default YogaDetailDrawer;
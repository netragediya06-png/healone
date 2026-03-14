import { motion } from 'framer-motion';
import { Clock, ChefHat, ArrowRight } from 'lucide-react';
import { Remedy, remedyCategories } from '@/lib/remedies-data';

interface RemedyCardProps {
  remedy: Remedy;
  index: number;
  onViewDetail: (remedy: Remedy) => void;
}

const RemedyCard = ({ remedy, index, onViewDetail }: RemedyCardProps) => {
  const categoryLabel = remedyCategories.find(c => c.id === remedy.category)?.label;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card rounded-2xl border overflow-hidden hover:shadow-elevated transition-all group cursor-pointer"
      onClick={() => onViewDetail(remedy)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={remedy.image}
          alt={remedy.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-background/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <ChefHat className="h-3 w-3" /> {remedy.difficulty}
          </span>
          <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="h-3 w-3" /> {remedy.duration}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <img
              src={remedy.specialist.image}
              alt={remedy.specialist.name}
              className="w-6 h-6 rounded-full border-2 border-background/50 object-cover"
            />
            <span className="text-background text-xs font-medium truncate">
              {remedy.specialist.name}
            </span>
          </div>
        </div>
      </div>

      <div className="p-5">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {categoryLabel}
        </span>
        <h3 className="font-display font-bold text-lg mt-1 group-hover:text-primary transition-colors">
          {remedy.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 italic">{remedy.subtitle}</p>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{remedy.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {remedy.doshaAffinity.map(dosha => (
            <span
              key={dosha}
              className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
            >
              {dosha}
            </span>
          ))}
        </div>

        <button className="mt-4 flex items-center gap-1.5 text-sm text-primary font-semibold group-hover:gap-2.5 transition-all">
          View Full Remedy <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default RemedyCard;

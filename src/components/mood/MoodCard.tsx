import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { LucideIcon } from 'lucide-react';

export interface Mood {
  slug: string;
  icon: LucideIcon;
  labelKey: string;
}

interface MoodCardProps {
  mood: Mood;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export default function MoodCard({ mood, isSelected, onClick, index }: MoodCardProps) {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`mood-card ${isSelected ? 'mood-card-selected' : ''}`}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
          <mood.icon className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-center">
          {t(mood.labelKey)}
        </h3>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}
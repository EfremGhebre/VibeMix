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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        mood-card ${isSelected ? 'mood-card-selected' : ''}
        touch-manipulation min-h-[100px] sm:min-h-[120px]
        active:shadow-inner transition-all duration-200
      `}
    >
      <div className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4">
        <div className="animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
          <mood.icon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
        </div>
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-center leading-tight">
          {t(mood.labelKey)}
        </h3>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Selection indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full shadow-glow"
        />
      )}
    </motion.div>
  );
}
import { useState } from 'react';
import { motion } from 'framer-motion';
import MoodCard, { type Mood } from './MoodCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Smile, 
  Snowflake, 
  Target, 
  Cloud, 
  Zap, 
  Heart, 
  Crown, 
  Music, 
  CloudRain,
  Car,
  Sun,
  Flame
} from 'lucide-react';

const moods: Mood[] = [
  { slug: 'happy', icon: Smile, labelKey: 'mood.happy' },
  { slug: 'chill', icon: Snowflake, labelKey: 'mood.chill' },
  { slug: 'sad', icon: Cloud, labelKey: 'mood.sad' },
  { slug: 'focus', icon: Target, labelKey: 'mood.focus' },
  { slug: 'energetic', icon: Zap, labelKey: 'mood.energetic' },
  { slug: 'party', icon: Music, labelKey: 'mood.party' },
  { slug: 'romantic', icon: Heart, labelKey: 'mood.romantic' },
  { slug: 'confident', icon: Crown, labelKey: 'mood.confident' },
  { slug: 'rainy', icon: CloudRain, labelKey: 'mood.rainy' },
  { slug: 'mellow', icon: Sun, labelKey: 'mood.mellow' },
];

interface MoodGridProps {
  selectedMood?: string;
  onMoodSelect: (moodSlug: string) => void;
}

export default function MoodGrid({ selectedMood, onMoodSelect }: MoodGridProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold gradient-text mb-2">
          {t('mood.select')}
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {moods.map((mood, index) => (
          <MoodCard
            key={mood.slug}
            mood={mood}
            isSelected={selectedMood === mood.slug}
            onClick={() => onMoodSelect(mood.slug)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

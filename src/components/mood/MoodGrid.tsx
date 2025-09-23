import { useState } from 'react';
import { motion } from 'framer-motion';
import MoodCard, { type Mood } from './MoodCard';
import { useLanguage } from '@/contexts/LanguageContext';

const moods: Mood[] = [
  { slug: 'happy', emoji: '😊', labelKey: 'mood.happy' },
  { slug: 'chill', emoji: '🧊', labelKey: 'mood.chill' },
  { slug: 'focus', emoji: '🎯', labelKey: 'mood.focus' },
  { slug: 'sad', emoji: '🌧️', labelKey: 'mood.sad' },
  { slug: 'energetic', emoji: '⚡', labelKey: 'mood.energetic' },
  { slug: 'romantic', emoji: '💞', labelKey: 'mood.romantic' },
  { slug: 'confident', emoji: '🦁', labelKey: 'mood.confident' },
  { slug: 'mellow', emoji: '🍃', labelKey: 'mood.mellow' },
  { slug: 'party', emoji: '🎉', labelKey: 'mood.party' },
  { slug: 'rainy', emoji: '☔', labelKey: 'mood.rainy' },
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
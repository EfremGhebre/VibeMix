import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const musicLanguages = [
  { code: 'en', name: 'English' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ti', name: 'Tigrinya' },
  { code: 'es', name: 'Spanish' },
  { code: 'hi', name: 'Hindi' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
];

interface LanguageFilterProps {
  selectedLanguages: string[];
  onLanguageToggle: (languageCode: string) => void;
}

export default function LanguageFilter({ selectedLanguages, onLanguageToggle }: LanguageFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mb-6"
      >
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {t('language.select')}
        </h3>
      </motion.div>

      <div className="flex flex-wrap gap-3 justify-center">
        {musicLanguages.map((lang, index) => {
          const isSelected = selectedLanguages.includes(lang.code);
          
          return (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => onLanguageToggle(lang.code)}
              className={`language-chip ${isSelected ? 'language-chip-selected' : ''}`}
            >
              {lang.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
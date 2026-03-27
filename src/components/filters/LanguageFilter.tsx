import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const musicLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'ti', name: 'Tigrinya', flag: '🇪🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
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
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-6"
      >
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {t('language.select')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('language.subtitle')}
        </p>
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
              className={`language-chip ${isSelected ? 'language-chip-selected' : ''} flex items-center gap-2`}
            >
              <span className="text-lg">{lang.flag}</span>
              {lang.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

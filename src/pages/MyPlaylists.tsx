import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SavedVibesList from '@/components/playlist/SavedVibesList';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MyPlaylists() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface-elevated">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{t('nav.savedVibes')}</h1>
              <p className="text-muted-foreground">Your saved mood-based mixes — open them anytime in any platform.</p>
            </div>
            <SavedVibesList />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Radio, Headphones, Stars, ArrowRight, Target, Palette, Globe, Smile, Snowflake, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import MoodCard from '@/components/mood/MoodCard';

const featuredMoods = [
  { slug: 'happy', icon: Smile, labelKey: 'mood.happy' },
  { slug: 'chill', icon: Snowflake, labelKey: 'mood.chill' },
  { slug: 'energetic', icon: Zap, labelKey: 'mood.energetic' },
];

const Index = () => {
  const { t } = useLanguage();

  const handleGetStarted = () => {
    window.location.href = '/discover';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface-elevated">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Radio className="h-16 w-16 text-primary animate-pulse-glow" />
                <Stars className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-6xl font-bold gradient-text mb-6 leading-tight">
              {t('app.name')}
            </h1>
            
            <p className="text-2xl text-primary font-semibold mb-4">
              {t('app.tagline')}
            </p>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('app.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16"
          >
            <Button onClick={handleGetStarted} className="hero-button text-lg group">
              <Headphones className="mr-3 h-5 w-5 group-hover:animate-bounce" />
              {t('button.getStarted')}
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Featured Moods Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Choose your vibe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMoods.map((mood, index) => (
              <MoodCard
                key={mood.slug}
                mood={mood}
                isSelected={false}
                onClick={handleGetStarted}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border/40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mood-Based</h3>
            <p className="text-muted-foreground">Select your current mood and let our algorithm find the perfect tracks that match your energy.</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40 hover:border-secondary/30 transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Palette className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Genre</h3>
            <p className="text-muted-foreground">Mix and match from multiple genres to create unique playlists that reflect your diverse taste.</p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40 hover:border-accent/30 transition-colors">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
              <Globe className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Language</h3>
            <p className="text-muted-foreground">Discover music in multiple languages and expand your musical horizons across cultures.</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;

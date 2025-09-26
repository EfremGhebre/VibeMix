import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Radio, Headphones, Stars, ArrowRight, Target, Palette, Globe, Smile, Snowflake, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import MoodCard from '@/components/mood/MoodCard';
import MusicDiscoveryWidget from '@/components/features/MusicDiscoveryWidget';

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
      <section className="container mx-auto px-4 py-12 sm:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Radio className="h-12 w-12 sm:h-16 sm:w-16 text-primary animate-pulse-glow" />
                <Stars className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-6 sm:w-6 text-accent animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-6 leading-tight px-4">
              {t('app.name')}
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-primary font-semibold mb-4 px-4">
              {t('app.tagline')}
            </p>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              {t('app.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 sm:mb-16"
          >
            <Button onClick={handleGetStarted} className="hero-button text-base sm:text-lg group h-12 sm:h-14 px-6 sm:px-8">
              <Headphones className="mr-2 sm:mr-3 h-5 w-5 group-hover:animate-bounce" />
              Start Your Musical Journey
              <ArrowRight className="ml-2 sm:ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Benefits Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Instant Playlist Creation</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Generate perfectly curated playlists in seconds. Just pick your mood, select genres, and let our AI do the magic.
                </p>
              </div>

              <div className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">Global Music Discovery</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Explore music from around the world in multiple languages. Discover your next favorite artist from any culture.
                </p>
              </div>
            </div>

            <div className="text-center max-w-2xl mx-auto px-4">
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Join thousands of music lovers who have already discovered their perfect soundtracks. 
                <span className="text-primary font-medium"> Start your musical journey today!</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button onClick={handleGetStarted} size="lg" className="text-sm sm:text-base h-12 sm:h-14">
                  <Headphones className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Explore Music
                </Button>
                <Button variant="outline" size="lg" className="text-sm sm:text-base h-12 sm:h-14" onClick={() => {
                  const element = document.getElementById('music-discovery');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <Stars className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Try Interactive Demo
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Music Discovery Section */}
      <section id="music-discovery" className="container mx-auto px-4 py-12 sm:py-20 border-t border-border/40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-6">Experience VibeMix</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get a taste of what VibeMix can do. Explore trending genres or preview our curated music selection.
          </p>
          <MusicDiscoveryWidget />
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-12 sm:py-20 border-t border-border/40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-6">How It Works</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Creating your perfect playlist is just three simple steps away
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Choose Your Mood</h3>
              <p className="text-muted-foreground">
                Select from various moods like Happy, Chill, Energetic, or Romantic. Our AI understands the emotional context you're looking for.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center text-2xl font-bold text-secondary">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Pick Genres & Language</h3>
              <p className="text-muted-foreground">
                Customize your playlist by selecting genres you love and choose from multiple languages to discover global music.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Your Playlist</h3>
              <p className="text-muted-foreground">
                Our intelligent algorithm instantly creates a personalized playlist that perfectly matches your mood and preferences.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 sm:py-20 border-t border-border/40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40 hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Mood-Based</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Select your current mood and let our algorithm find the perfect tracks that match your energy.</p>
          </div>

          <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40 hover:border-secondary/30 transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Multi-Genre</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Mix and match from multiple genres to create unique playlists that reflect your diverse taste.</p>
          </div>

          <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40 hover:border-accent/30 transition-colors">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 rounded-xl bg-accent/10 flex items-center justify-center">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Multi-Language</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Discover music in multiple languages and expand your musical horizons across cultures.</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;

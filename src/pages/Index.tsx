import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Radio, Sparkles, Stars, ArrowRight, Globe, Smile, Music2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface IndexProps {
  onOpenChat?: () => void;
}

const Index = ({ onOpenChat }: IndexProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/discover');
    } else {
      navigate({ pathname: '/', search: '?auth=login' });
    }
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
              {t('hero.headline')}
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              {t('hero.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 sm:mb-16"
          >
            <Button onClick={handleGetStarted} className="hero-button text-base sm:text-lg group h-12 sm:h-14 px-6 sm:px-8">
              <Sparkles className="mr-2 sm:mr-3 h-5 w-5 group-hover:animate-bounce" />
              {t('hero.cta')}
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
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
              <div className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Smile className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">{t('features.moodBased')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t('features.moodBasedDesc')}
                </p>
              </div>

              <div className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-secondary/10 flex items-center justify-center">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">{t('features.multiLanguage')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t('features.multiLanguageDesc')}
                </p>
              </div>

              <div className="text-center p-4 sm:p-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Music2 className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3">{t('features.platformFree')}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t('features.platformFreeDesc')}
                </p>
              </div>

              <motion.div
                className="text-center p-4 sm:p-6 rounded-2xl cursor-pointer group relative overflow-hidden transition-all duration-300 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10 border border-transparent hover:border-primary/20"
                onClick={onOpenChat}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3">AI Music Assistant</h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Chat with our AI assistant anytime — get help, explore features, or find your perfect vibe.
                  </p>
                  <span className="inline-flex items-center mt-3 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageCircle className="h-3 w-3 mr-1" /> Click to chat
                  </span>
                </div>
              </motion.div>
            </div>

            <div className="text-center max-w-2xl mx-auto px-4">
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                {t('features.joinThousands')}{' '}
                <span className="text-primary font-medium">{t('features.startToday')}</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button onClick={handleGetStarted} size="lg" className="text-sm sm:text-base h-12 sm:h-14">
                  <Sparkles className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t('hero.cta')}
                </Button>
                <Button variant="outline" size="lg" className="text-sm sm:text-base h-12 sm:h-14" onClick={() => {
                  const element = document.getElementById('how-it-works');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <Stars className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {t('hero.learnMore')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-12 sm:py-20 border-t border-border/40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-6">{t('howItWorks.title')}</h2>
          <p className="text-lg text-muted-foreground mb-12">
            {t('howItWorks.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">1</div>
              <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step1')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step1Desc')}</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center text-2xl font-bold text-secondary">2</div>
              <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step2')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step2Desc')}</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center text-2xl font-bold text-accent">3</div>
              <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step3')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step3Desc')}</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-surface to-surface-elevated border border-border/40">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">4</div>
              <h3 className="text-xl font-semibold mb-3">{t('howItWorks.step4')}</h3>
              <p className="text-muted-foreground">{t('howItWorks.step4Desc')}</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;

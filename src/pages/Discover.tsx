import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MoodGrid from '@/components/mood/MoodGrid';
import GenreFilter from '@/components/filters/GenreFilter';
import LanguageFilter from '@/components/filters/LanguageFilter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function Discover() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Pop']);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleLanguageToggle = (languageCode: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageCode)
        ? prev.filter(l => l !== languageCode)
        : [...prev, languageCode]
    );
  };

  const handleGeneratePlaylist = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling to generate your playlist",
        variant: "destructive",
      });
      return;
    }

    if (selectedGenres.length === 0) {
      toast({
        title: "Please select at least one genre",
        description: "Pick some music genres you'd like to hear",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call our playlist generation edge function
      const { data, error } = await supabase.functions.invoke('generate-playlist', {
        body: {
          mood: selectedMood,
          genres: selectedGenres,
          languages: selectedLanguages,
          userId: user?.id,
        }
      });

      if (error) {
        console.error('Playlist generation error:', error);
        
        // Try to extract the specific error message from the edge function response
        let errorMessage = "Please make sure you're logged in and have connected Spotify.";
        
        if (error.message) {
          // If it's a supabase error with details
          try {
            const errorData = JSON.parse(error.message);
            errorMessage = errorData.error || error.message;
          } catch {
            // If parsing fails, use the message as is
            errorMessage = error.message;
          }
        }
        
        toast({
          title: "Failed to generate playlist",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const playlist = data.playlist;
      toast({
        title: "🎵 Playlist generated!",
        description: `Created "${playlist.title}" with ${playlist.track_count} tracks. Check your profile to view it!`,
      });

      // Reset form
      setSelectedMood('');
      setSelectedGenres(['Pop']);
      setSelectedLanguages(['en']);

    } catch (error) {
      console.error('Error generating playlist:', error);
      toast({
        title: "Error",
        description: "Failed to generate playlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const canGeneratePlaylist = selectedMood && selectedGenres.length > 0 && selectedLanguages.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface-elevated">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4 leading-tight">
            {t('discover.title')}
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('discover.subtitle')}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
          {/* Mood Selection */}
          <MoodGrid selectedMood={selectedMood} onMoodSelect={setSelectedMood} />

          {/* Genre Filter */}
          <GenreFilter selectedGenres={selectedGenres} onGenreToggle={handleGenreToggle} />

          {/* Language Filter */}
          <LanguageFilter selectedLanguages={selectedLanguages} onLanguageToggle={handleLanguageToggle} />

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center pt-6 sm:pt-8"
          >
            <Button
              onClick={handleGeneratePlaylist}
              disabled={!canGeneratePlaylist || isGenerating}
              className="hero-button text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 relative group h-14 sm:h-16 touch-manipulation"
            >
              {isGenerating ? (
                <>
                  <Music2 className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="hidden sm:inline">{t('discover.creatingVibe')}</span>
                  <span className="sm:hidden">{t('discover.creating')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" />
                  <span className="hidden sm:inline">{t('button.generatePlaylist')}</span>
                  <span className="sm:hidden">{t('discover.generate')}</span>
                </>
              )}
            </Button>
            
            {selectedMood && selectedGenres.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs sm:text-sm text-muted-foreground mt-4 px-4 leading-relaxed"
              >
                {t('discover.readyGenerate')} <span className="text-primary font-medium">{selectedMood}</span> {t('discover.playlistWith')}{' '}
                <span className="text-secondary font-medium">{selectedGenres.join(', ')}</span> {t('discover.music')}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
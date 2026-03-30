import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MoodGrid from '@/components/mood/MoodGrid';
import GenreFilter from '@/components/filters/GenreFilter';
import LanguageFilter from '@/components/filters/LanguageFilter';
import PlaylistResult from '@/components/playlist/PlaylistResult';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface GeneratedPlaylist {
  id: string;
  title: string;
  description: string;
  mood: string;
  track_count: number;
  tracks: Array<{
    title: string;
    artist: string;
    album?: string;
    genre?: string;
    language?: string;
    energy_score?: number;
    mood_tags?: string[];
    spotify_search_url?: string;
    apple_music_search_url?: string;
    youtube_music_search_url?: string;
  }>;
}

export default function Discover() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlaylist, setGeneratedPlaylist] = useState<GeneratedPlaylist | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const handleLanguageToggle = (languageCode: string) => {
    setSelectedLanguages(prev => 
      prev.includes(languageCode) ? prev.filter(l => l !== languageCode) : [...prev, languageCode]
    );
  };

  const handleGeneratePlaylist = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to generate and save your playlists.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMood) {
      toast({
        title: t('discover.selectMoodTitle'),
        description: t('discover.selectMoodDesc'),
        variant: "destructive",
      });
      return;
    }

    if (selectedLanguages.length === 0) {
      toast({
        title: "Select a language",
        description: "Choose at least one music language for your mix.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedPlaylist(null);
    setIsSaved(false);

    try {
      const { data, error } = await supabase.functions.invoke('generate-playlist', {
        body: {
          mood: selectedMood,
          genres: selectedGenres,
          languages: selectedLanguages,
          userId: user.id,
        }
      });

      if (error) {
        let errorMessage = "Something went wrong. Please try again.";
        if (error.message) {
          try {
            const errorData = JSON.parse(error.message);
            errorMessage = errorData.error || error.message;
          } catch {
            errorMessage = error.message;
          }
        }
        toast({ title: "Failed to generate mix", description: errorMessage, variant: "destructive" });
        return;
      }

      setGeneratedPlaylist(data.playlist);
      toast({
        title: "🎵 Your mix is ready!",
        description: `Created "${data.playlist.title}" with ${data.playlist.track_count} tracks.`,
      });
    } catch (error) {
      console.error('Error generating playlist:', error);
      toast({ title: "Error", description: "Failed to generate mix. Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user || !generatedPlaylist) return;
    try {
      const { error } = await supabase
        .from('saved_vibes')
        .insert({
          user_id: user.id,
          playlist_id: generatedPlaylist.id,
        });
      if (error) throw error;
      setIsSaved(true);
      toast({ title: "Mix saved!", description: "Find it in your Saved Vibes." });
    } catch (error) {
      console.error('Error saving:', error);
      toast({ title: "Error", description: "Failed to save mix.", variant: "destructive" });
    }
  };

  const handleRegenerate = () => {
    setGeneratedPlaylist(null);
    setIsSaved(false);
    handleGeneratePlaylist();
  };

  const handleCloseResult = () => {
    setGeneratedPlaylist(null);
    setIsSaved(false);
  };

  const canGenerate = selectedMood && selectedLanguages.length > 0;

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

        {/* Show result if generated */}
        {generatedPlaylist ? (
          <PlaylistResult
            playlist={generatedPlaylist}
            onSave={handleSave}
            onRegenerate={handleRegenerate}
            onClose={handleCloseResult}
            saved={isSaved}
          />
        ) : (
          <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
            {/* Mood Selection */}
            <MoodGrid selectedMood={selectedMood} onMoodSelect={setSelectedMood} />

            {/* Language Filter - PROMINENT */}
            <LanguageFilter selectedLanguages={selectedLanguages} onLanguageToggle={handleLanguageToggle} />

            {/* Genre Filter - Optional */}
            <GenreFilter selectedGenres={selectedGenres} onGenreToggle={handleGenreToggle} />

            {/* Generate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center pt-6 sm:pt-8"
            >
              <Button
                onClick={handleGeneratePlaylist}
                disabled={!canGenerate || isGenerating}
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
                    <span className="hidden sm:inline">{t('button.generateMix')}</span>
                    <span className="sm:hidden">{t('discover.generate')}</span>
                  </>
                )}
              </Button>
              
              {selectedMood && selectedLanguages.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs sm:text-sm text-muted-foreground mt-4 px-4 leading-relaxed"
                >
                  {t('discover.readyGenerate')} <span className="text-primary font-medium capitalize">{selectedMood}</span> {t('discover.mixIn')}{' '}
                  <span className="text-secondary font-medium">{selectedLanguages.length} {selectedLanguages.length === 1 ? 'language' : 'languages'}</span>
                </motion.p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

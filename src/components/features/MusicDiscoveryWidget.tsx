import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music2, 
  Sparkles, 
  TrendingUp, 
  Play, 
  Heart,
  Shuffle,
  SkipForward,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const trendingGenres = [
  { name: 'Lo-Fi Hip Hop', growth: '+24%', color: 'bg-purple-500' },
  { name: 'Indie Pop', growth: '+18%', color: 'bg-pink-500' },
  { name: 'Electronic', growth: '+32%', color: 'bg-blue-500' },
  { name: 'Alternative Rock', growth: '+15%', color: 'bg-green-500' },
];

const mockTracks = [
  {
    title: 'Midnight Vibes',
    artist: 'Luna Dreams',
    genre: 'Lo-Fi Hip Hop',
    duration: '3:42',
    popularity: 92
  },
  {
    title: 'Neon Lights',
    artist: 'Cyber Echo',
    genre: 'Electronic',
    duration: '4:15',
    popularity: 88
  },
  {
    title: 'Coffee Shop Blues',
    artist: 'Urban Acoustic',
    genre: 'Indie Folk',
    duration: '3:28',
    popularity: 85
  }
];

export default function MusicDiscoveryWidget() {
  const [currentView, setCurrentView] = useState<'trending' | 'preview'>('trending');
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentTrack(prev => (prev + 1) % mockTracks.length);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const toggleView = () => {
    setCurrentView(prev => prev === 'trending' ? 'preview' : 'trending');
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-surface via-surface to-surface-elevated border-primary/20 shadow-xl overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Music2 className="h-8 w-8 text-primary" />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-accent animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold gradient-text">
                  {currentView === 'trending' ? 'Trending Now' : 'Music Preview'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentView === 'trending' 
                    ? 'Discover what\'s hot in music right now' 
                    : 'Experience VibeMix\'s curated selection'
                  }
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleView}>
              <Shuffle className="h-4 w-4 mr-2" />
              Switch
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {currentView === 'trending' ? (
              <motion.div
                key="trending"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {trendingGenres.map((genre, index) => (
                    <motion.div
                      key={genre.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-background to-muted/50 border border-border/50 hover:border-primary/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${genre.color}`} />
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <h4 className="font-semibold text-sm sm:text-base mb-1">{genre.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {genre.growth}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                
                <div className="pt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Ready to explore these trending sounds?
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/discover'}
                    className="hero-button group"
                  >
                    <Play className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                    Start Discovering
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-lg mb-1">
                        {mockTracks[currentTrack].title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {mockTracks[currentTrack].artist} • {mockTracks[currentTrack].genre}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Play className={`h-5 w-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{Math.floor((progress / 100) * 222)}s</span>
                      <span>{mockTracks[currentTrack].duration}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setCurrentTrack(prev => (prev + 1) % mockTracks.length)}
                      >
                        <SkipForward className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Volume2 className="h-4 w-4" />
                      <span>{mockTracks[currentTrack].popularity}% popularity</span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    This is just a preview of what VibeMix can create for you
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/discover'}
                    className="hero-button group"
                  >
                    <Sparkles className="h-4 w-4 mr-2 group-hover:animate-bounce" />
                    Create Your Playlist
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
import { motion } from 'framer-motion';
import { Music2, ExternalLink, Bookmark, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Track {
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
}

interface PlaylistResultData {
  id: string;
  title: string;
  description: string;
  mood: string;
  track_count: number;
  tracks: Track[];
}

interface PlaylistResultProps {
  playlist: PlaylistResultData;
  onSave?: () => void;
  onRegenerate?: () => void;
  onClose?: () => void;
  saved?: boolean;
}

export default function PlaylistResult({ playlist, onSave, onRegenerate, onClose, saved }: PlaylistResultProps) {
  const openInPlatform = (track: Track, platform: 'spotify' | 'apple_music' | 'youtube_music') => {
    const urls: Record<string, string | undefined> = {
      spotify: track.spotify_search_url,
      apple_music: track.apple_music_search_url,
      youtube_music: track.youtube_music_search_url,
    };
    const url = urls[platform];
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  const openAllInPlatform = (platform: 'spotify' | 'apple_music' | 'youtube_music') => {
    const firstTrack = playlist.tracks[0];
    if (firstTrack) {
      const query = encodeURIComponent(`${playlist.title}`);
      const urls: Record<string, string> = {
        spotify: `https://open.spotify.com/search/${query}`,
        apple_music: `https://music.apple.com/search?term=${query}`,
        youtube_music: `https://www.youtube.com/results?search_query=${query}`,
      };
      window.open(urls[platform], '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-surface via-surface to-surface-elevated">
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Music2 className="h-6 w-6 text-primary" />
                <Badge variant="secondary" className="capitalize">{playlist.mood}</Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{playlist.title}</h2>
              <p className="text-muted-foreground">{playlist.description}</p>
              <p className="text-sm text-muted-foreground mt-1">{playlist.track_count} tracks</p>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Platform buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              onClick={() => openAllInPlatform('spotify')}
              className="bg-[hsl(141,73%,42%)] hover:bg-[hsl(141,73%,35%)] text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Spotify
            </Button>
            <Button
              onClick={() => openAllInPlatform('apple_music')}
              variant="outline"
              className="border-[hsl(350,80%,55%)] text-[hsl(350,80%,55%)] hover:bg-[hsl(350,80%,55%)]/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Apple Music
            </Button>
            <Button
              onClick={() => openAllInPlatform('youtube_music')}
              variant="outline"
              className="border-[hsl(0,100%,50%)] text-[hsl(0,100%,50%)] hover:bg-[hsl(0,100%,50%)]/10"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in YouTube Music
            </Button>
          </div>

          {/* Track list */}
          <div className="space-y-2 mb-8">
            {playlist.tracks.map((track, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <span className="text-sm text-muted-foreground w-6 text-right font-mono">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-foreground">{track.title}</p>
                  <p className="text-sm text-muted-foreground truncate">{track.artist}{track.album ? ` • ${track.album}` : ''}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  {track.genre && <Badge variant="outline" className="text-xs">{track.genre}</Badge>}
                </div>
                {/* Per-track platform links */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openInPlatform(track, 'spotify')} title="Open in Spotify">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer actions */}
          <div className="flex flex-wrap gap-3 border-t border-border/40 pt-6">
            {onSave && (
              <Button onClick={onSave} variant={saved ? "secondary" : "default"} disabled={saved}>
                <Bookmark className="h-4 w-4 mr-2" />
                {saved ? 'Saved!' : 'Save Mix'}
              </Button>
            )}
            {onRegenerate && (
              <Button onClick={onRegenerate} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Mix
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

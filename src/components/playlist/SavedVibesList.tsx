import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface SavedPlaylist {
  id: string;
  title: string;
  description: string | null;
  mood: string;
  selected_filters: any;
  created_at: string;
  items_count?: number;
}

export default function SavedVibesList() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState<SavedPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchPlaylists();
  }, [user]);

  const fetchPlaylists = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('generated_playlists')
        .select('*, generated_playlist_items(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlaylists(
        (data || []).map(p => ({
          ...p,
          items_count: Array.isArray(p.generated_playlist_items) ? p.generated_playlist_items.length : 0,
        }))
      );
    } catch (error) {
      console.error('Error:', error);
      toast({ title: "Error", description: "Failed to load saved vibes", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (playlistId: string) => {
    try {
      // Delete items first, then playlist
      await supabase.from('generated_playlist_items').delete().eq('playlist_id', playlistId);
      await supabase.from('saved_vibes').delete().eq('playlist_id', playlistId);
      await supabase.from('generated_playlists').delete().eq('id', playlistId);
      setPlaylists(prev => prev.filter(p => p.id !== playlistId));
      toast({ title: "Deleted", description: "Mix removed." });
    } catch {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  const openPlaylistInPlatform = (playlistTitle: string, platform: 'spotify' | 'apple_music' | 'youtube_music') => {
    const query = encodeURIComponent(playlistTitle);
    const urls: Record<'spotify' | 'apple_music' | 'youtube_music', string> = {
      spotify: `https://open.spotify.com/search/${query}`,
      apple_music: `https://music.apple.com/search?term=${query}`,
      youtube_music: `https://www.youtube.com/results?search_query=${query}`,
    };
    window.open(urls[platform], '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6"><div className="h-6 bg-muted rounded w-3/4 mb-2" /><div className="h-4 bg-muted rounded w-1/2" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
        <Card className="border-dashed">
          <CardContent className="py-12">
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No saved vibes yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Generate your first mix and save it to build your collection.
            </p>
            <Button onClick={() => navigate('/discover')} className="hero-button">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Mix
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {playlists.map((playlist, index) => (
        <motion.div
          key={playlist.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="overflow-hidden hover:shadow-elevated transition-all">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg text-foreground truncate">{playlist.title}</h3>
                    <Badge variant="secondary" className="capitalize text-xs shrink-0">{playlist.mood}</Badge>
                  </div>
                  {playlist.description && (
                    <p className="text-sm text-muted-foreground mb-2">{playlist.description}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{new Date(playlist.created_at).toLocaleDateString()}</span>
                    {playlist.selected_filters?.languages && (
                      <span>🌍 {(playlist.selected_filters.languages as string[]).join(', ')}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive/60 hover:text-destructive shrink-0"
                  onClick={() => handleDelete(playlist.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPlaylistInPlatform(playlist.title, 'spotify')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> Spotify
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPlaylistInPlatform(playlist.title, 'apple_music')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> Apple Music
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openPlaylistInPlatform(playlist.title, 'youtube_music')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> YouTube
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

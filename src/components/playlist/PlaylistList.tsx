import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PlaylistCard from './PlaylistCard';
import { Card, CardContent } from '@/components/ui/card';
import { Music, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface Playlist {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
  is_public: boolean;
  track_count?: number;
}

interface PlaylistListProps {
  showCreateButton?: boolean;
  limit?: number;
  className?: string;
}

export default function PlaylistList({ 
  showCreateButton = true, 
  limit,
  className = "" 
}: PlaylistListProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user, limit]);

  const fetchPlaylists = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get playlists with track count
      let query = supabase
        .from('playlists')
        .select(`
          id,
          title,
          description,
          cover_image_url,
          created_at,
          is_public,
          playlist_songs(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching playlists:', error);
        toast({
          title: "Error",
          description: "Failed to load playlists",
          variant: "destructive",
        });
        return;
      }

      // Transform data to include track count
      const playlistsWithCount = data?.map(playlist => ({
        ...playlist,
        track_count: Array.isArray(playlist.playlist_songs) ? playlist.playlist_songs.length : 0,
      })) || [];

      setPlaylists(playlistsWithCount);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast({
        title: "Error",
        description: "Failed to load playlists",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPlaylist = (playlistId: string) => {
    // TODO: Implement playlist playback
    toast({
      title: "Coming Soon",
      description: "Playlist playback feature is coming soon!",
    });
  };

  const handleViewPlaylist = (playlistId: string) => {
    // TODO: Navigate to playlist detail page
    toast({
      title: "Coming Soon",
      description: "Playlist detail view is coming soon!",
    });
  };

  const handleCreatePlaylist = () => {
    window.location.href = '/discover';
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-t-lg" />
            <CardContent className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (playlists.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-center py-12 ${className}`}
      >
        <Card className="border-dashed">
          <CardContent className="py-12">
            <Music className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Create your first playlist by discovering music based on your mood and preferences.
            </p>
            {showCreateButton && (
              <Button onClick={handleCreatePlaylist} className="hero-button">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Playlist
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {playlists.map((playlist, index) => (
        <motion.div
          key={playlist.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <PlaylistCard
            id={playlist.id}
            title={playlist.title}
            description={playlist.description || undefined}
            trackCount={playlist.track_count || 0}
            coverImageUrl={playlist.cover_image_url || undefined}
            createdAt={playlist.created_at}
            isPublic={playlist.is_public}
            onPlay={handlePlayPlaylist}
            onView={handleViewPlaylist}
          />
        </motion.div>
      ))}
    </div>
  );
}
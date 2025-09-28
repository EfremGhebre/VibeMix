import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Play, Clock, Share } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlaylistCardProps {
  id: string;
  title: string;
  description?: string;
  trackCount: number;
  coverImageUrl?: string;
  createdAt: string;
  isPublic?: boolean;
  onPlay?: (playlistId: string) => void;
  onView?: (playlistId: string) => void;
  className?: string;
}

export default function PlaylistCard({
  id,
  title,
  description,
  trackCount,
  coverImageUrl,
  createdAt,
  isPublic = false,
  onPlay,
  onView,
  className = "",
}: PlaylistCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className="overflow-hidden hover:shadow-elevated transition-all duration-300 group">
        {/* Cover Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <Music className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <Button
              size="icon"
              className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 rounded-full bg-primary hover:bg-primary-glow shadow-glow"
              onClick={() => onPlay?.(id)}
            >
              <Play className="h-5 w-5 text-white fill-white ml-0.5" />
            </Button>
          </div>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm line-clamp-2">
              {description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Music className="h-4 w-4" />
              <span>{trackCount} {trackCount === 1 ? 'track' : 'tracks'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onView?.(id)}
            >
              View Playlist
            </Button>
            {isPublic && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
              >
                <Share className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
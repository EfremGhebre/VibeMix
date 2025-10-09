import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import { getSpotifyAuthUrl } from '@/lib/spotify';

interface SpotifyConnectButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function SpotifyConnectButton({ 
  variant = "default", 
  size = "default",
  className = ""
}: SpotifyConnectButtonProps) {
  const handleConnect = () => {
    const authUrl = getSpotifyAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <Button 
      onClick={handleConnect}
      variant={variant}
      size={size}
      className={className}
    >
      <Music className="w-4 h-4 mr-2" />
      Connect Spotify
    </Button>
  );
}
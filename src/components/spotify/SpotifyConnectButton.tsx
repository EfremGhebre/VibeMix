import { Button } from '@/components/ui/button';
import { Music } from 'lucide-react';
import { getSpotifyAuthUrl } from '@/lib/spotify';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
  const { user, session, loading } = useAuth();

  const handleConnect = () => {
    // Check both user and session for more reliable authentication state
    const isAuthenticated = !!(user && session);
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in first before connecting to Spotify",
        variant: "destructive"
      });
      return;
    }

    const authUrl = getSpotifyAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <Button 
      onClick={handleConnect}
      variant={variant}
      size={size}
      className={className}
      disabled={loading}
    >
      <Music className="w-4 h-4 mr-2" />
      {loading ? "Loading..." : "Connect Spotify"}
    </Button>
  );
}
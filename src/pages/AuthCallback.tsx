import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAccessTokenFromCode, getSpotifyProfile } from '@/lib/spotify';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleSpotifyCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          toast({
            title: "Spotify Connection Failed",
            description: error === 'access_denied' 
              ? "You cancelled the Spotify authorization" 
              : `Spotify error: ${error}`,
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        if (!code) {
          toast({
            title: "Invalid Callback",
            description: "No authorization code received from Spotify",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        if (!user) {
          toast({
            title: "Authentication Required",
            description: "Please log in first before connecting Spotify",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        // Exchange code for access token
        const tokenData = await getAccessTokenFromCode(code);
        
        // Get Spotify profile
        const spotifyProfile = await getSpotifyProfile(tokenData.access_token);

        // Store tokens securely using edge function
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch('https://yjdwjprbsduenqlcvxyd.supabase.co/functions/v1/store-spotify-tokens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_in: tokenData.expires_in,
            scope: tokenData.scope,
            spotify_user_id: spotifyProfile.id,
            spotify_display_name: spotifyProfile.display_name,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to store Spotify tokens');
        }

        toast({
          title: "Spotify Connected!",
          description: `Successfully connected to ${spotifyProfile.display_name}'s Spotify account`,
        });
        
        navigate('/');
      } catch (error) {
        console.error('Spotify callback error:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Spotify. Please try again.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsProcessing(false);
      }
    };

    handleSpotifyCallback();
  }, [searchParams, navigate, user]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <h2 className="text-xl font-semibold">Connecting to Spotify...</h2>
          <p className="text-muted-foreground">Please wait while we set up your connection</p>
        </div>
      </div>
    );
  }

  return null;
}
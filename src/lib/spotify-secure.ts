import { supabase } from '@/integrations/supabase/client';

/**
 * Securely retrieve Spotify tokens for the authenticated user
 * Tokens are never exposed to the client - only returned from secure edge function
 */
export const getSpotifyTokens = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('User not authenticated');
  }

  const response = await fetch('https://yjdwjprbsduenqlcvxyd.supabase.co/functions/v1/get-spotify-tokens', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get Spotify tokens');
  }

  return response.json();
};

/**
 * Check if user has Spotify connected (without exposing tokens)
 */
export const hasSpotifyConnection = async () => {
  try {
    const { data, error } = await supabase.rpc('has_spotify_connection');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error checking Spotify connection:', error);
    return false;
  }
};

/**
 * Get Spotify user info (without exposing tokens)
 */
export const getSpotifyUserInfo = async () => {
  try {
    const { data, error } = await supabase.rpc('get_spotify_user_info');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting Spotify user info:', error);
    return null;
  }
};

/**
 * Securely search Spotify tracks using stored tokens
 */
export const searchSpotifyTracksSecure = async (query: string, limit = 20) => {
  const tokenData = await getSpotifyTokens();
  
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: limit.toString(),
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search Spotify tracks');
  }

  return response.json();
};

/**
 * Securely create Spotify playlist using stored tokens
 */
export const createSpotifyPlaylistSecure = async (
  name: string,
  description?: string,
  isPublic = false
) => {
  const tokenData = await getSpotifyTokens();
  const userInfo = await getSpotifyUserInfo();
  
  if (!userInfo || typeof userInfo !== 'object' || !('user_id' in userInfo) || !userInfo.user_id) {
    throw new Error('Spotify user ID not found');
  }

  const response = await fetch(`https://api.spotify.com/v1/users/${userInfo.user_id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      description,
      public: isPublic,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create Spotify playlist');
  }

  return response.json();
};

/**
 * Securely add tracks to Spotify playlist using stored tokens
 */
export const addTracksToPlaylistSecure = async (
  playlistId: string,
  trackUris: string[]
) => {
  const tokenData = await getSpotifyTokens();

  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uris: trackUris,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add tracks to playlist');
  }

  return response.json();
};
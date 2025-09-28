const SPOTIFY_CLIENT_ID = '658f820398dc48138cebe0706fc8fb0a';
const REDIRECT_URI = `${window.location.origin}/auth/callback`;
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-library-modify',
  'user-top-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming'
].join(' ');

export const getSpotifyAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const getAccessTokenFromCode = async (code: string) => {
  const response = await fetch('/api/spotify/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  return response.json();
};

export const getSpotifyProfile = async (accessToken: string) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify profile');
  }

  return response.json();
};

export const searchSpotifyTracks = async (accessToken: string, query: string, limit = 20) => {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: limit.toString(),
  });

  const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to search Spotify tracks');
  }

  return response.json();
};

export const createSpotifyPlaylist = async (
  accessToken: string,
  userId: string,
  name: string,
  description?: string,
  isPublic = false
) => {
  const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
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

export const addTracksToPlaylist = async (
  accessToken: string,
  playlistId: string,
  trackUris: string[]
) => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
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
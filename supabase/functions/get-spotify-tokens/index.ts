import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client with service role key to bypass RLS
    // This is secure because we verify the user's JWT token first
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Fetching Spotify tokens for user:', user.id);

    // Fetch the Spotify tokens from the database
    const { data: tokens, error: tokensError } = await supabase
      .from('spotify_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', user.id)
      .single();

    if (tokensError || !tokens) {
      console.error('No Spotify tokens found for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'No Spotify connection found. Please connect your Spotify account first.' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if token is expired and needs refresh
    const expiresAt = new Date(tokens.expires_at);
    const now = new Date();
    const isExpired = expiresAt <= now;

    if (isExpired && tokens.refresh_token) {
      console.log('Token expired, refreshing...');
      
      // Refresh the token
      const spotifyClientId = Deno.env.get('SPOTIFY_CLIENT_ID')!;
      const spotifyClientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')!;
      
      const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(`${spotifyClientId}:${spotifyClientSecret}`),
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: tokens.refresh_token,
        }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh Spotify token');
      }

      const refreshData = await refreshResponse.json();
      
      // Update the tokens in the database
      const newExpiresAt = new Date(now.getTime() + refreshData.expires_in * 1000);
      await supabase
        .from('spotify_tokens')
        .update({
          access_token: refreshData.access_token,
          expires_at: newExpiresAt.toISOString(),
        })
        .eq('user_id', user.id);

      console.log('Token refreshed successfully');

      return new Response(
        JSON.stringify({ access_token: refreshData.access_token }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Returning existing valid token');

    return new Response(
      JSON.stringify({ access_token: tokens.access_token }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in get-spotify-tokens:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

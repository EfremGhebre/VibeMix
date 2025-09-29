import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Create Supabase client with service role key for secure operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify the JWT token and get user
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Invalid or expired token');
    }

    // Get Spotify tokens for the authenticated user
    const { data: tokenData, error: tokenError } = await supabase
      .from('spotify_tokens')
      .select('access_token, refresh_token, expires_at, scope')
      .eq('user_id', user.id)
      .single();

    if (tokenError) {
      if (tokenError.code === 'PGRST116') {
        // No tokens found
        return new Response(
          JSON.stringify({ error: 'No Spotify connection found' }),
          {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      console.error('Error retrieving Spotify tokens:', tokenError);
      throw new Error('Failed to retrieve Spotify tokens');
    }

    // Check if token is expired
    const isExpired = tokenData.expires_at && new Date(tokenData.expires_at) <= new Date();
    
    if (isExpired && tokenData.refresh_token) {
      // Refresh the token
      const spotifyClientId = Deno.env.get('SPOTIFY_CLIENT_ID');
      const spotifyClientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');
      
      if (!spotifyClientId || !spotifyClientSecret) {
        throw new Error('Spotify credentials not configured');
      }

      const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${spotifyClientId}:${spotifyClientSecret}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: tokenData.refresh_token,
        }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh Spotify token');
      }

      const newTokenData = await refreshResponse.json();
      
      // Update the tokens in database
      const newExpiresAt = new Date(Date.now() + newTokenData.expires_in * 1000).toISOString();
      
      const { error: updateError } = await supabase
        .from('spotify_tokens')
        .update({
          access_token: newTokenData.access_token,
          refresh_token: newTokenData.refresh_token || tokenData.refresh_token,
          expires_at: newExpiresAt,
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating refreshed tokens:', updateError);
        throw new Error('Failed to update refreshed tokens');
      }

      console.log(`Successfully refreshed Spotify tokens for user ${user.id}`);
      
      return new Response(
        JSON.stringify({
          access_token: newTokenData.access_token,
          expires_at: newExpiresAt,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Return existing valid token
    return new Response(
      JSON.stringify({
        access_token: tokenData.access_token,
        expires_at: tokenData.expires_at,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-spotify-tokens function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
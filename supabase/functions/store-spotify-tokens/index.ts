import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation for Spotify token data
const validateSpotifyTokenInput = (data: any) => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request data format');
  }
  
  const { access_token, refresh_token, expires_in, scope, spotify_user_id, spotify_display_name } = data;
  
  // Validate required fields
  if (!access_token || typeof access_token !== 'string' || access_token.length > 2048) {
    throw new Error('Invalid or missing access_token');
  }
  
  if (!spotify_user_id || typeof spotify_user_id !== 'string' || spotify_user_id.length > 100) {
    throw new Error('Invalid or missing spotify_user_id');
  }
  
  // Validate optional fields
  if (refresh_token && (typeof refresh_token !== 'string' || refresh_token.length > 2048)) {
    throw new Error('Invalid refresh_token format');
  }
  
  if (expires_in && (typeof expires_in !== 'number' || expires_in < 0 || expires_in > 86400)) {
    throw new Error('Invalid expires_in value (must be between 0-86400 seconds)');
  }
  
  if (scope && (typeof scope !== 'string' || scope.length > 500)) {
    throw new Error('Invalid scope format');
  }
  
  if (spotify_display_name && (typeof spotify_display_name !== 'string' || spotify_display_name.length > 100)) {
    throw new Error('Invalid spotify_display_name format');
  }
  
  return {
    access_token: access_token.trim(),
    refresh_token: refresh_token?.trim() || null,
    expires_in,
    scope: scope?.trim() || null,
    spotify_user_id: spotify_user_id.trim(),
    spotify_display_name: spotify_display_name?.trim() || null
  };
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

    // Parse and validate request body
    const requestBody = await req.json();
    const validatedData = validateSpotifyTokenInput(requestBody);
    
    const {
      access_token,
      refresh_token,
      expires_in,
      scope,
      spotify_user_id,
      spotify_display_name
    } = validatedData;

    // Calculate expiration time
    const expires_at = expires_in 
      ? new Date(Date.now() + expires_in * 1000).toISOString()
      : null;

    // Store tokens securely in spotify_tokens table
    const { error: tokenError } = await supabase
      .from('spotify_tokens')
      .upsert({
        user_id: user.id,
        access_token,
        refresh_token,
        expires_at,
        scope,
        token_type: 'Bearer'
      });

    if (tokenError) {
      console.error('Error storing Spotify tokens:', tokenError);
      throw new Error('Failed to store Spotify tokens');
    }

    // Update user preferences with Spotify user info (non-sensitive data)
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        spotify_user_id,
        spotify_display_name
      });

    if (prefsError) {
      console.error('Error updating user preferences:', prefsError);
      throw new Error('Failed to update user preferences');
    }

    console.log(`Successfully stored Spotify tokens for user ${user.id}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in store-spotify-tokens function:', error);
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
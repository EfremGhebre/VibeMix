import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation function
function validateInput(data: any) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request format');
  }
  
  const { code, redirect_uri } = data;
  
  // Validate code format and length
  if (!code || typeof code !== 'string' || code.length > 512 || !/^[A-Za-z0-9_-]+$/.test(code)) {
    throw new Error('Invalid authorization code format');
  }
  
  // Validate redirect_uri format and length
  if (!redirect_uri || typeof redirect_uri !== 'string' || redirect_uri.length > 255) {
    throw new Error('Invalid redirect URI');
  }
  
  // Validate redirect_uri is a valid URL
  try {
    new URL(redirect_uri);
  } catch {
    throw new Error('Invalid redirect URI format');
  }
  
  return { 
    code: code.trim(), 
    redirect_uri: redirect_uri.trim() 
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      throw new Error('Authentication required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);

    if (authError || !user) {
      console.error('Authentication failed:', authError);
      throw new Error('Invalid authentication');
    }

    console.log('Authenticated user:', user.id);

    // Parse and validate input
    const requestData = await req.json();
    const { code, redirect_uri } = validateInput(requestData);
    
    if (!code || !redirect_uri) {
      throw new Error('Missing required parameters');
    }

    const spotifyClientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    if (!spotifyClientId) {
      throw new Error('Spotify client ID not configured');
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: spotifyClientId,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Spotify token exchange failed:', errorData);
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    
    console.log('Successfully exchanged code for Spotify token');

    return new Response(JSON.stringify(tokenData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in spotify-token function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
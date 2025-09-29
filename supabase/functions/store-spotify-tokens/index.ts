import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    // Create Supabase client with service role key for secure operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the user's JWT token
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      throw new Error('Invalid or expired token');
    }

    const { 
      access_token, 
      refresh_token, 
      expires_in,
      scope,
      spotify_user_id,
      spotify_display_name 
    } = await req.json();
    
    if (!access_token) {
      throw new Error('Missing required parameters');
    }

    // Calculate expiration time
    const expires_at = expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null;

    // Securely store tokens in the spotify_tokens table
    const { error: tokenError } = await supabase
      .from('spotify_tokens')
      .upsert({
        user_id: user.id,
        access_token,
        refresh_token,
        expires_at,
        scope,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (tokenError) {
      console.error('Error storing Spotify tokens:', tokenError);
      throw new Error('Failed to store Spotify tokens');
    }

    // Update user preferences with Spotify user info (non-sensitive data only)
    const { error: prefsError } = await supabase
      .from('user_preferences')
      .update({
        spotify_user_id,
        spotify_display_name,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id);

    if (prefsError) {
      console.error('Error updating user preferences:', prefsError);
      throw new Error('Failed to update user preferences');
    }

    console.log('Successfully stored Spotify tokens for user:', user.id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in store-spotify-tokens function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
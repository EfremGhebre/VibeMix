/// <reference path="../types.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const DEFAULT_TRACK_COUNT = 15;

function normalizeValue(value: string): string {
  return value.trim().toLowerCase();
}

function validateInput(data: unknown) {
  if (!data || typeof data !== 'object') throw new Error('Request body must be an object');
  const { mood, genres, languages, userId } = data as Record<string, unknown>;
  if (!mood || typeof mood !== 'string') throw new Error('Mood is required');
  if (!Array.isArray(languages) || languages.length === 0) throw new Error('Languages must be a non-empty array');
  if (!userId || typeof userId !== 'string') throw new Error('User ID is required');
  if (genres !== undefined && !Array.isArray(genres)) throw new Error('Genres must be an array');

  const cleanedLanguages = languages
    .filter((language): language is string => typeof language === 'string')
    .map(normalizeValue)
    .filter((language, index, arr) => language.length > 0 && arr.indexOf(language) === index);

  if (cleanedLanguages.length === 0) throw new Error('Languages must include at least one valid value');

  const cleanedGenres = (genres || [])
    .filter((genre): genre is string => typeof genre === 'string')
    .map(normalizeValue)
    .filter((genre, index, arr) => genre.length > 0 && arr.indexOf(genre) === index);

  return {
    mood: normalizeValue(mood),
    genres: cleanedGenres,
    languages: cleanedLanguages,
    userId: userId.trim(),
  };
}

function generatePlaylistTitle(mood: string, languages: string[]): string {
  const langNames: Record<string, string> = {
    en: 'English', ar: 'Arabic', sv: 'Swedish', ti: 'Tigrinya',
    es: 'Spanish', fr: 'French', hi: 'Hindi',
  };
  const moodCapitalized = mood.charAt(0).toUpperCase() + mood.slice(1);
  const langPart = languages.length <= 2
    ? languages.map(l => langNames[l] || l).join(' & ')
    : 'Multilingual';
  return `${moodCapitalized} ${langPart} Mix`;
}

function generateDescription(mood: string): string {
  const descriptions: Record<string, string> = {
    happy: 'An uplifting collection of feel-good tracks to brighten your day.',
    chill: 'Relaxing tunes to help you unwind and find your calm.',
    sad: 'A reflective mix for when you need to feel and process emotions.',
    focus: 'Concentration-boosting tracks to help you get in the zone.',
    energetic: 'High-energy bangers to power your workout or adventure.',
    romantic: 'Love songs and romantic melodies for those special moments.',
    confident: 'Empowering tracks to boost your confidence and swagger.',
    mellow: 'Soft, soothing music for a gentle and peaceful vibe.',
    party: 'Dance-worthy hits to get the party started.',
    rainy: 'Cozy tracks perfect for rainy days and quiet contemplation.',
  };
  return descriptions[mood] || `A curated mix to match your ${mood} mood.`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { mood, genres, languages, userId } = validateInput(requestData);
    console.log('Generating playlist for:', { mood, genres, languages, userId });

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const playlistTitle = generatePlaylistTitle(mood, languages);
    const playlistDescription = generateDescription(mood);

    // Save to generated_playlists table
    const { data: playlist, error: playlistError } = await supabase
      .from('generated_playlists')
      .insert({
        user_id: userId,
        title: playlistTitle,
        description: playlistDescription,
        mood,
        selected_filters: { genres, languages },
      })
      .select()
      .single();

    if (playlistError) {
      console.error('Error creating playlist:', playlistError);
      return new Response(
        JSON.stringify({ error: 'Failed to save playlist' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Playlist created:', playlist.id);

    return new Response(
      JSON.stringify({
        playlist: {
          id: playlist.id,
          title: playlistTitle,
          description: playlistDescription,
          mood,
          track_count: DEFAULT_TRACK_COUNT,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

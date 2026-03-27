import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Curated music database organized by mood, genre, and language
const musicDatabase: Record<string, Array<{title: string; artist: string; album?: string; genre: string; language: string; energy_score: number; mood_tags: string[]}>> = {
  // English tracks
  'en': [
    { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', language: 'en', energy_score: 85, mood_tags: ['energetic', 'party', 'confident'] },
    { title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', language: 'en', energy_score: 88, mood_tags: ['happy', 'party', 'energetic'] },
    { title: 'Stay With Me', artist: 'Sam Smith', album: 'In the Lonely Hour', genre: 'Pop', language: 'en', energy_score: 40, mood_tags: ['sad', 'romantic', 'mellow'] },
    { title: 'Shape of You', artist: 'Ed Sheeran', album: '÷', genre: 'Pop', language: 'en', energy_score: 75, mood_tags: ['happy', 'romantic'] },
    { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', language: 'en', energy_score: 80, mood_tags: ['energetic', 'confident'] },
    { title: 'Someone Like You', artist: 'Adele', album: '21', genre: 'Pop', language: 'en', energy_score: 35, mood_tags: ['sad', 'romantic', 'rainy'] },
    { title: 'Uptown Funk', artist: 'Bruno Mars', album: 'Uptown Special', genre: 'Pop', language: 'en', energy_score: 95, mood_tags: ['happy', 'party', 'energetic'] },
    { title: 'Thinking Out Loud', artist: 'Ed Sheeran', album: 'x', genre: 'Pop', language: 'en', energy_score: 45, mood_tags: ['romantic', 'mellow', 'chill'] },
    { title: 'Lose Yourself', artist: 'Eminem', album: '8 Mile', genre: 'Hip-Hop', language: 'en', energy_score: 90, mood_tags: ['energetic', 'confident', 'focus'] },
    { title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', genre: 'Pop', language: 'en', energy_score: 72, mood_tags: ['happy', 'chill'] },
    { title: 'Sunflower', artist: 'Post Malone', album: 'Spider-Man: Into the Spider-Verse', genre: 'Hip-Hop', language: 'en', energy_score: 65, mood_tags: ['chill', 'happy'] },
    { title: 'drivers license', artist: 'Olivia Rodrigo', album: 'SOUR', genre: 'Pop', language: 'en', energy_score: 30, mood_tags: ['sad', 'rainy', 'romantic'] },
    { title: 'Circles', artist: 'Post Malone', album: "Hollywood's Bleeding", genre: 'Pop', language: 'en', energy_score: 55, mood_tags: ['chill', 'mellow', 'sad'] },
    { title: 'Bad Guy', artist: 'Billie Eilish', album: 'WHEN WE ALL FALL ASLEEP', genre: 'Pop', language: 'en', energy_score: 70, mood_tags: ['confident', 'party'] },
    { title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', genre: 'Electronic', language: 'en', energy_score: 78, mood_tags: ['energetic', 'party'] },
    { title: 'Weightless', artist: 'Marconi Union', album: 'Weightless', genre: 'Electronic', language: 'en', energy_score: 15, mood_tags: ['chill', 'focus', 'mellow'] },
    { title: 'Redbone', artist: 'Childish Gambino', album: 'Awaken, My Love!', genre: 'R&B', language: 'en', energy_score: 50, mood_tags: ['chill', 'romantic', 'mellow'] },
    { title: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', genre: 'Indie', language: 'en', energy_score: 75, mood_tags: ['happy', 'energetic', 'party'] },
    { title: 'All of Me', artist: 'John Legend', album: 'Love in the Future', genre: 'R&B', language: 'en', energy_score: 40, mood_tags: ['romantic', 'mellow'] },
    { title: 'Stressed Out', artist: 'Twenty One Pilots', album: 'Blurryface', genre: 'Rock', language: 'en', energy_score: 65, mood_tags: ['focus', 'sad'] },
    { title: 'Can\'t Stop the Feeling!', artist: 'Justin Timberlake', genre: 'Pop', language: 'en', energy_score: 90, mood_tags: ['happy', 'party', 'energetic'] },
    { title: 'Lovely', artist: 'Billie Eilish & Khalid', genre: 'Pop', language: 'en', energy_score: 25, mood_tags: ['sad', 'rainy', 'mellow'] },
    { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', genre: 'Rock', language: 'en', energy_score: 60, mood_tags: ['confident', 'chill'] },
    { title: 'Night Changes', artist: 'One Direction', genre: 'Pop', language: 'en', energy_score: 50, mood_tags: ['romantic', 'happy', 'mellow'] },
    { title: 'Lofi Study Beats', artist: 'ChilledCow', genre: 'Electronic', language: 'en', energy_score: 30, mood_tags: ['focus', 'chill', 'mellow'] },
  ],
  // Arabic tracks
  'ar': [
    { title: 'Bahebek Wahashteeni', artist: 'Amr Diab', genre: 'Pop', language: 'ar', energy_score: 55, mood_tags: ['romantic', 'happy'] },
    { title: 'Tamally Maak', artist: 'Amr Diab', genre: 'Pop', language: 'ar', energy_score: 60, mood_tags: ['romantic', 'happy'] },
    { title: 'Ah W Noss', artist: 'Nancy Ajram', genre: 'Pop', language: 'ar', energy_score: 80, mood_tags: ['happy', 'party', 'energetic'] },
    { title: 'Enta Eih', artist: 'Nancy Ajram', genre: 'Pop', language: 'ar', energy_score: 50, mood_tags: ['romantic', 'sad'] },
    { title: 'Ya Tabtab', artist: 'Nancy Ajram', genre: 'Pop', language: 'ar', energy_score: 85, mood_tags: ['happy', 'party'] },
    { title: 'Habibi Ya Nour El Ain', artist: 'Amr Diab', genre: 'Pop', language: 'ar', energy_score: 70, mood_tags: ['romantic', 'happy'] },
    { title: 'Baed Annak', artist: 'Amr Diab', genre: 'Pop', language: 'ar', energy_score: 40, mood_tags: ['sad', 'romantic', 'mellow'] },
    { title: 'Ehsas Gdeed', artist: 'Elissa', genre: 'Pop', language: 'ar', energy_score: 55, mood_tags: ['romantic', 'mellow'] },
    { title: 'Boshret Kheir', artist: 'Hussain Al Jassmi', genre: 'Pop', language: 'ar', energy_score: 90, mood_tags: ['happy', 'party', 'energetic'] },
    { title: 'Ana Nebt', artist: 'Cairokee', genre: 'Rock', language: 'ar', energy_score: 75, mood_tags: ['energetic', 'confident'] },
    { title: 'Kan Ya Makan', artist: 'Fairuz', genre: 'Classical', language: 'ar', energy_score: 30, mood_tags: ['chill', 'mellow', 'rainy'] },
    { title: 'Nassam Alayna El Hawa', artist: 'Fairuz', genre: 'Classical', language: 'ar', energy_score: 35, mood_tags: ['romantic', 'chill', 'mellow'] },
  ],
  // Swedish tracks
  'sv': [
    { title: 'Jag är fri', artist: 'Laleh', genre: 'Pop', language: 'sv', energy_score: 70, mood_tags: ['happy', 'energetic', 'confident'] },
    { title: 'Goliat', artist: 'Laleh', genre: 'Pop', language: 'sv', energy_score: 65, mood_tags: ['confident', 'focus'] },
    { title: 'Vart du än går', artist: 'Håkan Hellström', genre: 'Rock', language: 'sv', energy_score: 60, mood_tags: ['romantic', 'happy'] },
    { title: 'Känn ingen sorg', artist: 'Håkan Hellström', genre: 'Rock', language: 'sv', energy_score: 80, mood_tags: ['happy', 'energetic', 'party'] },
    { title: 'En del av mitt hjärta', artist: 'Håkan Hellström', genre: 'Rock', language: 'sv', energy_score: 55, mood_tags: ['romantic', 'mellow'] },
    { title: 'Ängeln i rummet', artist: 'Veronica Maggio', genre: 'Pop', language: 'sv', energy_score: 65, mood_tags: ['happy', 'romantic'] },
    { title: 'Hela huset', artist: 'Veronica Maggio', genre: 'Pop', language: 'sv', energy_score: 60, mood_tags: ['chill', 'happy'] },
    { title: 'Mitt lilla land', artist: 'Veronica Maggio', genre: 'Pop', language: 'sv', energy_score: 50, mood_tags: ['mellow', 'romantic'] },
    { title: 'Din tid kommer', artist: 'Miriam Bryant', genre: 'Pop', language: 'sv', energy_score: 75, mood_tags: ['confident', 'energetic'] },
    { title: 'Handen i fickan fast jag pekar', artist: 'Veronica Maggio', genre: 'Pop', language: 'sv', energy_score: 55, mood_tags: ['chill', 'happy', 'mellow'] },
  ],
  // Tigrinya tracks
  'ti': [
    { title: 'Hade Lbi', artist: 'Helen Meles', genre: 'Pop', language: 'ti', energy_score: 55, mood_tags: ['romantic', 'mellow'] },
    { title: 'Tezarebeni', artist: 'Helen Meles', genre: 'Pop', language: 'ti', energy_score: 60, mood_tags: ['happy', 'romantic'] },
    { title: 'Lomi Beal', artist: 'Bereket Mengisteab', genre: 'Pop', language: 'ti', energy_score: 65, mood_tags: ['happy', 'romantic'] },
    { title: 'Awet N\'Hafash', artist: 'Yemane Barya', genre: 'Pop', language: 'ti', energy_score: 70, mood_tags: ['confident', 'energetic'] },
    { title: 'Shikor', artist: 'Dehab Faytinga', genre: 'Pop', language: 'ti', energy_score: 75, mood_tags: ['energetic', 'party'] },
    { title: 'Kemey Aley', artist: 'Abraham Afewerki', genre: 'Pop', language: 'ti', energy_score: 50, mood_tags: ['romantic', 'chill'] },
    { title: 'Eritrea', artist: 'Wedi Tikabo', genre: 'Pop', language: 'ti', energy_score: 80, mood_tags: ['happy', 'energetic', 'confident'] },
    { title: 'Adey', artist: 'Tsehaytu Beraki', genre: 'Pop', language: 'ti', energy_score: 45, mood_tags: ['mellow', 'romantic', 'sad'] },
  ],
  // Spanish tracks
  'es': [
    { title: 'Despacito', artist: 'Luis Fonsi', genre: 'Latin', language: 'es', energy_score: 80, mood_tags: ['happy', 'party', 'romantic'] },
    { title: 'Vivir Mi Vida', artist: 'Marc Anthony', genre: 'Latin', language: 'es', energy_score: 90, mood_tags: ['happy', 'party', 'energetic'] },
    { title: 'Bailando', artist: 'Enrique Iglesias', genre: 'Latin', language: 'es', energy_score: 85, mood_tags: ['party', 'happy', 'energetic'] },
    { title: 'La Bicicleta', artist: 'Shakira & Carlos Vives', genre: 'Latin', language: 'es', energy_score: 78, mood_tags: ['happy', 'energetic'] },
    { title: 'Recuérdame', artist: 'Various Artists', album: 'Coco', genre: 'Latin', language: 'es', energy_score: 40, mood_tags: ['sad', 'romantic', 'mellow'] },
    { title: 'Malamente', artist: 'Rosalía', genre: 'Pop', language: 'es', energy_score: 72, mood_tags: ['confident', 'energetic'] },
    { title: 'Ojos Así', artist: 'Shakira', genre: 'Latin', language: 'es', energy_score: 75, mood_tags: ['energetic', 'confident'] },
    { title: 'Clandestino', artist: 'Manu Chao', genre: 'Latin', language: 'es', energy_score: 55, mood_tags: ['chill', 'mellow'] },
  ],
  // French tracks
  'fr': [
    { title: 'Alors on danse', artist: 'Stromae', genre: 'Electronic', language: 'fr', energy_score: 82, mood_tags: ['party', 'energetic'] },
    { title: 'Formidable', artist: 'Stromae', genre: 'Pop', language: 'fr', energy_score: 50, mood_tags: ['sad', 'romantic'] },
    { title: 'Je Veux', artist: 'Zaz', genre: 'Pop', language: 'fr', energy_score: 75, mood_tags: ['happy', 'energetic'] },
    { title: 'La Vie en Rose', artist: 'Edith Piaf', genre: 'Classical', language: 'fr', energy_score: 40, mood_tags: ['romantic', 'mellow', 'chill'] },
    { title: 'Tous les mêmes', artist: 'Stromae', genre: 'Pop', language: 'fr', energy_score: 65, mood_tags: ['confident', 'focus'] },
    { title: 'Papaoutai', artist: 'Stromae', genre: 'Electronic', language: 'fr', energy_score: 80, mood_tags: ['energetic', 'party'] },
    { title: 'Les Champs-Élysées', artist: 'Joe Dassin', genre: 'Pop', language: 'fr', energy_score: 60, mood_tags: ['happy', 'chill'] },
    { title: 'Non, je ne regrette rien', artist: 'Edith Piaf', genre: 'Classical', language: 'fr', energy_score: 55, mood_tags: ['confident', 'mellow'] },
  ],
  // Hindi tracks
  'hi': [
    { title: 'Tum Hi Ho', artist: 'Arijit Singh', genre: 'Pop', language: 'hi', energy_score: 50, mood_tags: ['romantic', 'sad'] },
    { title: 'Kal Ho Naa Ho', artist: 'Sonu Nigam', genre: 'Pop', language: 'hi', energy_score: 65, mood_tags: ['romantic', 'happy'] },
    { title: 'Chaiyya Chaiyya', artist: 'Sukhwinder Singh', genre: 'Pop', language: 'hi', energy_score: 90, mood_tags: ['energetic', 'party', 'happy'] },
    { title: 'Kabira', artist: 'Arijit Singh & Tochi Raina', genre: 'Pop', language: 'hi', energy_score: 55, mood_tags: ['romantic', 'chill'] },
    { title: 'Tujhe Dekha Toh', artist: 'Kumar Sanu & Lata Mangeshkar', genre: 'Pop', language: 'hi', energy_score: 60, mood_tags: ['romantic', 'happy'] },
    { title: 'Kun Faya Kun', artist: 'A.R. Rahman', genre: 'Pop', language: 'hi', energy_score: 35, mood_tags: ['chill', 'focus', 'mellow'] },
    { title: 'Jai Ho', artist: 'A.R. Rahman', genre: 'Pop', language: 'hi', energy_score: 88, mood_tags: ['energetic', 'happy', 'confident'] },
    { title: 'Channa Mereya', artist: 'Arijit Singh', genre: 'Pop', language: 'hi', energy_score: 45, mood_tags: ['sad', 'romantic', 'rainy'] },
  ],
};

function validateInput(data: any) {
  if (!data || typeof data !== 'object') throw new Error('Request body must be an object');
  const { mood, genres, languages, userId } = data;
  if (!mood || typeof mood !== 'string') throw new Error('Mood is required');
  if (!Array.isArray(languages) || languages.length === 0) throw new Error('Languages must be a non-empty array');
  if (!userId || typeof userId !== 'string') throw new Error('User ID is required');
  return { mood: mood.trim(), genres: genres || [], languages, userId: userId.trim() };
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

function buildSearchUrl(title: string, artist: string, platform: 'spotify' | 'apple_music' | 'youtube_music'): string {
  const query = encodeURIComponent(`${title} ${artist}`);
  switch (platform) {
    case 'spotify': return `https://open.spotify.com/search/${query}`;
    case 'apple_music': return `https://music.apple.com/search?term=${query}`;
    case 'youtube_music': return `https://www.youtube.com/results?search_query=${query}`;
  }
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

    // Collect all candidate tracks from selected languages
    let candidates: typeof musicDatabase['en'] = [];
    for (const lang of languages) {
      const tracks = musicDatabase[lang] || [];
      candidates = candidates.concat(tracks);
    }
    // If no candidates, fall back to English
    if (candidates.length === 0) {
      candidates = musicDatabase['en'] || [];
    }

    // Score and filter tracks
    const scored = candidates.map(track => {
      let score = 0;
      // Mood match is primary
      if (track.mood_tags.includes(mood)) score += 50;
      // Genre match
      if (genres.length > 0 && genres.some((g: string) => track.genre.toLowerCase().includes(g.toLowerCase()))) score += 20;
      // Energy alignment
      const moodEnergy: Record<string, number> = {
        happy: 75, chill: 30, sad: 25, focus: 35, energetic: 90,
        romantic: 45, confident: 70, mellow: 25, party: 90, rainy: 30,
      };
      const targetEnergy = moodEnergy[mood] || 50;
      const energyDiff = Math.abs(track.energy_score - targetEnergy);
      score += Math.max(0, 30 - energyDiff);
      // Add small random factor for diversity
      score += Math.random() * 10;
      return { ...track, score };
    });

    // Sort by score and pick top 15
    scored.sort((a, b) => b.score - a.score);
    const selected = scored.slice(0, 15);

    if (selected.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No tracks found for your criteria. Try different options.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

    // Save playlist items
    const items = selected.map((track, index) => ({
      playlist_id: playlist.id,
      title: track.title,
      artist: track.artist,
      album: track.album || null,
      genre: track.genre,
      language: track.language,
      energy_score: track.energy_score,
      mood_tags: track.mood_tags,
      position: index + 1,
      spotify_search_url: buildSearchUrl(track.title, track.artist, 'spotify'),
      apple_music_search_url: buildSearchUrl(track.title, track.artist, 'apple_music'),
      youtube_music_search_url: buildSearchUrl(track.title, track.artist, 'youtube_music'),
    }));

    const { error: itemsError } = await supabase
      .from('generated_playlist_items')
      .insert(items);

    if (itemsError) {
      console.error('Error saving playlist items:', itemsError);
    }

    console.log('Playlist created:', playlist.id);

    return new Response(
      JSON.stringify({
        playlist: {
          id: playlist.id,
          title: playlistTitle,
          description: playlistDescription,
          mood,
          track_count: selected.length,
          tracks: items.map(item => ({
            title: item.title,
            artist: item.artist,
            album: item.album,
            genre: item.genre,
            language: item.language,
            energy_score: item.energy_score,
            mood_tags: item.mood_tags,
            spotify_search_url: item.spotify_search_url,
            apple_music_search_url: item.apple_music_search_url,
            youtube_music_search_url: item.youtube_music_search_url,
          })),
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

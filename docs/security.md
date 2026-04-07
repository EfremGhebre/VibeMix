# Security Notes

## Current Scope

VibeMix currently uses:

- `generate-playlist` (authenticated edge function)
- `send-support-email` (public edge function)

The previous Spotify OAuth token flow has been removed from both app code and deployed Supabase functions.

## Data and Access Model

- Users must be authenticated to generate and save playlists.
- Playlist data is stored in Supabase tables and scoped per user in app queries.
- Music is not streamed or hosted by VibeMix; platform links are opened externally.

## Edge Function Security

### `generate-playlist`
- JWT verification is enabled in `supabase/config.toml`.
- Uses service role key server-side only.
- Validates request body fields (`mood`, `languages`, `userId`, optional `genres`).

### `send-support-email`
- JWT verification is intentionally disabled to allow guest support requests.
- Should include abuse controls (rate limits/CAPTCHA) at app or gateway level.

## Environment Variables

```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
```

## Operational Checklist

1. Keep edge function secrets only in Supabase dashboard, not in frontend code.
2. Review RLS policies for playlist-related tables after schema changes.
3. Monitor edge function logs for abuse/spikes and failed auth patterns.
4. Remove unused functions from Supabase when deprecating features.

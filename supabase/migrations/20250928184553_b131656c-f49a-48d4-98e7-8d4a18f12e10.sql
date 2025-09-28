-- Add Spotify integration columns to user_preferences table
ALTER TABLE public.user_preferences 
ADD COLUMN spotify_access_token TEXT,
ADD COLUMN spotify_refresh_token TEXT,
ADD COLUMN spotify_user_id TEXT,
ADD COLUMN spotify_display_name TEXT;
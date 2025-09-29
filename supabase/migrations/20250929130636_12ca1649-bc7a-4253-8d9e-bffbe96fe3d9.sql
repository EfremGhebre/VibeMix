-- Fix security vulnerability: Secure Spotify token storage
-- Create a separate secure table for Spotify authentication tokens

-- Create secure Spotify tokens table
CREATE TABLE public.spotify_tokens (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  access_token text NOT NULL,
  refresh_token text,
  token_type text DEFAULT 'Bearer',
  expires_at timestamp with time zone,
  scope text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on the new table
ALTER TABLE public.spotify_tokens ENABLE ROW LEVEL SECURITY;

-- Create restrictive RLS policies - tokens should NEVER be returned in SELECT operations
-- Only allow INSERT, UPDATE, DELETE operations for the user's own tokens
CREATE POLICY "Users can insert their own spotify tokens" 
ON public.spotify_tokens 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own spotify tokens" 
ON public.spotify_tokens 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own spotify tokens" 
ON public.spotify_tokens 
FOR DELETE 
USING (auth.uid() = user_id);

-- NO SELECT policy - tokens should only be accessed via secure functions

-- Create a secure function to check if user has Spotify connected (without exposing tokens)
CREATE OR REPLACE FUNCTION public.has_spotify_connection(user_id_param uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.spotify_tokens 
    WHERE user_id = user_id_param
      AND access_token IS NOT NULL
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

-- Create a secure function to get Spotify user info (without exposing tokens)
CREATE OR REPLACE FUNCTION public.get_spotify_user_info(user_id_param uuid DEFAULT auth.uid())
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'connected', EXISTS (
      SELECT 1 FROM public.spotify_tokens 
      WHERE user_id = user_id_param
    ),
    'user_id', (
      SELECT spotify_user_id 
      FROM public.user_preferences 
      WHERE user_id = user_id_param
    ),
    'display_name', (
      SELECT spotify_display_name 
      FROM public.user_preferences 
      WHERE user_id = user_id_param
    )
  );
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_spotify_tokens_updated_at
  BEFORE UPDATE ON public.spotify_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing token data from user_preferences to secure table
INSERT INTO public.spotify_tokens (user_id, access_token, refresh_token, created_at, updated_at)
SELECT 
  user_id,
  spotify_access_token,
  spotify_refresh_token,
  created_at,
  updated_at
FROM public.user_preferences 
WHERE spotify_access_token IS NOT NULL;

-- Remove sensitive token columns from user_preferences (keep user info only)
ALTER TABLE public.user_preferences 
DROP COLUMN IF EXISTS spotify_access_token,
DROP COLUMN IF EXISTS spotify_refresh_token;
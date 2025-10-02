-- Add SELECT policy for spotify_tokens table
-- This allows users to view only their own Spotify tokens
-- Following the principle of least privilege and explicit access control

CREATE POLICY "Users can view their own spotify tokens"
ON public.spotify_tokens
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
-- Add explicit deny policy for audit logs
-- This prevents accidental exposure and documents security intent
CREATE POLICY "Deny user access to audit logs"
ON public.spotify_token_audit_log
FOR SELECT
USING (false);
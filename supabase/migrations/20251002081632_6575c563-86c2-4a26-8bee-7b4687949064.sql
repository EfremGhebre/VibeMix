-- Create audit log table for tracking sensitive token access
-- This helps monitor for suspicious activity and unauthorized access attempts

CREATE TABLE IF NOT EXISTS public.spotify_token_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log table
ALTER TABLE public.spotify_token_audit_log ENABLE ROW LEVEL SECURITY;

-- Only allow service role to insert audit logs (edge functions)
-- Users cannot view or modify audit logs
CREATE POLICY "Service role can insert audit logs"
ON public.spotify_token_audit_log
FOR INSERT
TO service_role
WITH CHECK (true);

-- Create index for efficient querying by user and timestamp
CREATE INDEX IF NOT EXISTS idx_spotify_token_audit_log_user_created 
ON public.spotify_token_audit_log(user_id, created_at DESC);

-- Create index for monitoring failed access attempts
CREATE INDEX IF NOT EXISTS idx_spotify_token_audit_log_failed 
ON public.spotify_token_audit_log(success, created_at DESC) 
WHERE success = false;
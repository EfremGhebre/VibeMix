-- Fix security vulnerability: Restrict profile visibility to own profiles only
-- Remove the overly permissive policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add a policy to allow viewing profiles when explicitly shared (future-proofing)
-- This can be enabled later if you want to implement friend/connection features
-- CREATE POLICY "Users can view shared profiles" 
-- ON public.profiles 
-- FOR SELECT 
-- USING (
--   auth.uid() = user_id OR 
--   EXISTS (
--     SELECT 1 FROM public.user_connections 
--     WHERE requester_id = auth.uid() 
--     AND accepter_id = user_id 
--     AND status = 'accepted'
--   )
-- );
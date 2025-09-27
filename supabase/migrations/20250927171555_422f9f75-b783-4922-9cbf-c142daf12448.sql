-- Add first_name and last_name columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN first_name TEXT,
ADD COLUMN last_name TEXT;

-- Copy existing display_name data to first_name (split by space)
UPDATE public.profiles 
SET first_name = CASE 
    WHEN display_name IS NOT NULL AND display_name != '' THEN 
        TRIM(SPLIT_PART(display_name, ' ', 1))
    ELSE NULL 
END,
last_name = CASE 
    WHEN display_name IS NOT NULL AND display_name != '' AND POSITION(' ' IN display_name) > 0 THEN 
        TRIM(SUBSTRING(display_name FROM POSITION(' ' IN display_name) + 1))
    ELSE NULL 
END;

-- Remove old columns
ALTER TABLE public.profiles 
DROP COLUMN display_name,
DROP COLUMN username;

-- Update the handle_new_user function to use first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;
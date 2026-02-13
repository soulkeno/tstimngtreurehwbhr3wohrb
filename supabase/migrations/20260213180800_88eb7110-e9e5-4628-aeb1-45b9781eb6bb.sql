
-- Add description_effect column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS description_effect TEXT NOT NULL DEFAULT 'none';

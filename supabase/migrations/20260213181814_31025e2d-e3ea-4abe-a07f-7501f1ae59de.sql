-- Fix: Allow users to insert badges regardless of is_custom value
DROP POLICY IF EXISTS "Auth users can create custom badges" ON public.badges;

CREATE POLICY "Auth users can create badges"
ON public.badges
FOR INSERT
WITH CHECK (auth.uid() = created_by);
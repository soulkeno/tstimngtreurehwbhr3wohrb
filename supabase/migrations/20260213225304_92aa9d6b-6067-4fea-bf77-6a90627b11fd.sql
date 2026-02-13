
-- Allow users to delete their own badges
CREATE POLICY "Users can delete own badges"
ON public.badges
FOR DELETE
USING (auth.uid() = created_by);

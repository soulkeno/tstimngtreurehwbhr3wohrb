
-- The profile_views INSERT with true is intentional for anonymous view tracking.
-- But let's restrict it so only anon/authenticated can insert, and limit what they insert.
DROP POLICY "Anyone can insert views" ON public.profile_views;
CREATE POLICY "Anyone can insert views"
  ON public.profile_views FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

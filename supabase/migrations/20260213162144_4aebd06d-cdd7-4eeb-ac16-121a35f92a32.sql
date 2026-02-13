
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  avatar_url TEXT,
  location TEXT DEFAULT '',
  view_count INTEGER NOT NULL DEFAULT 0,
  -- Design settings
  music_url TEXT,
  video_bg_url TEXT,
  custom_cursor_url TEXT,
  display_name_effect TEXT NOT NULL DEFAULT 'none', -- none, glow, butterflies
  background_effect TEXT NOT NULL DEFAULT 'none', -- none, blur, snowflakes, rain
  cursor_effect TEXT NOT NULL DEFAULT 'none', -- none, snow
  discord_user_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Public can view any profile
CREATE POLICY "Anyone can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Badges table
CREATE TABLE public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon_url TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "Auth users can create custom badges"
  ON public.badges FOR INSERT
  WITH CHECK (auth.uid() = created_by AND is_custom = true);

-- User-badge assignments
CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view user badges"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own badges"
  ON public.user_badges FOR DELETE
  USING (auth.uid() = user_id);

-- Links table
CREATE TABLE public.links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL DEFAULT 'custom', -- youtube, discord, github, twitter, instagram, tiktok, telegram, email, website, roblox, custom
  label TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL,
  icon_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view links"
  ON public.links FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own links"
  ON public.links FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own links"
  ON public.links FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own links"
  ON public.links FOR DELETE
  USING (auth.uid() = user_id);

-- View tracking table
CREATE TABLE public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert views"
  ON public.profile_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Profile owners can view their views"
  ON public.profile_views FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE profiles.id = profile_views.profile_id AND profiles.user_id = auth.uid()
  ));

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles SET view_count = view_count + 1 WHERE id = NEW.profile_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_view
  AFTER INSERT ON public.profile_views
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_view_count();

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('music', 'music', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('badges', 'badges', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('cursors', 'cursors', true);

-- Storage policies
CREATE POLICY "Public read avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read music" ON storage.objects FOR SELECT USING (bucket_id = 'music');
CREATE POLICY "Auth upload music" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'music' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth update music" ON storage.objects FOR UPDATE USING (bucket_id = 'music' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete music" ON storage.objects FOR DELETE USING (bucket_id = 'music' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Auth upload videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth update videos" ON storage.objects FOR UPDATE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete videos" ON storage.objects FOR DELETE USING (bucket_id = 'videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read badges" ON storage.objects FOR SELECT USING (bucket_id = 'badges');
CREATE POLICY "Auth upload badges" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'badges' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete badges" ON storage.objects FOR DELETE USING (bucket_id = 'badges' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read cursors" ON storage.objects FOR SELECT USING (bucket_id = 'cursors');
CREATE POLICY "Auth upload cursors" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cursors' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Auth delete cursors" ON storage.objects FOR DELETE USING (bucket_id = 'cursors' AND auth.uid()::text = (storage.foldername(name))[1]);

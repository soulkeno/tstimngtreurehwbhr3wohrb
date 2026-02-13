import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Eye, MapPin } from 'lucide-react';
import { MusicPlayer } from '@/components/profile/MusicPlayer';
import { SocialIcons } from '@/components/profile/SocialIcons';
import { SnowEffect } from '@/components/profile/SnowEffect';
import { RainEffect } from '@/components/profile/RainEffect';
import { CursorSnowTrail } from '@/components/profile/CursorSnowTrail';
import { ButterflyEffect } from '@/components/profile/ButterflyEffect';

interface ProfileData {
  id: string;
  username: string;
  display_name: string;
  description: string;
  avatar_url: string | null;
  location: string;
  view_count: number;
  music_url: string | null;
  video_bg_url: string | null;
  custom_cursor_url: string | null;
  display_name_effect: string;
  background_effect: string;
  cursor_effect: string;
  discord_user_id: string | null;
}

interface BadgeData {
  badge_id: string;
  badges: { icon_url: string; name: string };
}

interface LinkData {
  id: string;
  platform: string;
  label: string;
  url: string;
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [notFound, setNotFound] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      const { data: p } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase())
        .maybeSingle();

      if (!p) { setNotFound(true); return; }
      setProfile(p as ProfileData);

      // Track view
      await supabase.from('profile_views').insert({ profile_id: p.id });

      // Load badges and links in parallel
      const [{ data: b }, { data: l }] = await Promise.all([
        supabase
          .from('user_badges')
          .select('badge_id, badges(icon_url, name)')
          .eq('user_id', p.user_id)
          .order('sort_order'),
        supabase
          .from('links')
          .select('*')
          .eq('user_id', p.user_id)
          .order('sort_order'),
      ]);

      if (b) setBadges(b as any);
      if (l) setLinks(l as LinkData[]);
    };
    load();
  }, [username]);

  // 3D tilt effect
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale3d(1.04, 1.04, 1.04)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
  }, []);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">User not found</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden"
      style={profile.custom_cursor_url ? { cursor: `url(${profile.custom_cursor_url}), auto` } : undefined}
    >
      {/* Video background */}
      {profile.video_bg_url && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          src={profile.video_bg_url}
        />
      )}

      {/* Background effects */}
      {profile.background_effect === 'blur' && (
        <div className="absolute inset-0 backdrop-blur-sm" />
      )}
      {profile.background_effect === 'snowflakes' && <SnowEffect />}
      {profile.background_effect === 'rain' && <RainEffect />}

      {/* Cursor effects */}
      {profile.cursor_effect === 'snow' && <CursorSnowTrail />}

      {/* Main card */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative z-10 w-full max-w-lg mx-4 glass-card rounded-2xl p-6 transition-transform duration-200 ease-out"
      >
        {/* Top section: avatar + stats */}
        <div className="flex items-start justify-between mb-4">
          <div>
            {profile.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-24 h-24 rounded-xl object-cover border-2 border-border"
              />
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {profile.view_count.toLocaleString()}
            </span>
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {profile.location}
              </span>
            )}
          </div>
        </div>

        {/* Name + badges */}
        <div className="mb-1 relative" ref={nameRef}>
          {profile.display_name_effect === 'butterflies' && <ButterflyEffect targetRef={nameRef} />}
          <div className="flex items-center gap-2">
            <h1
              className={`text-3xl font-bold text-foreground leading-none ${
                profile.display_name_effect === 'glow' ? 'glow-text' : ''
              }`}
            >
              {profile.display_name || profile.username}
            </h1>
            <div className="flex items-center gap-1 shrink-0">
              {badges.map((b) => (
                <img
                  key={b.badge_id}
                  src={b.badges.icon_url}
                  alt={b.badges.name}
                  title={b.badges.name}
                  className="w-5 h-5 object-contain"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {profile.description && (
          <p className="text-muted-foreground text-sm mb-4">{profile.description}</p>
        )}

        {/* Social icons */}
        {links.length > 0 && <SocialIcons links={links} />}

        {/* Music player */}
        {profile.music_url && (
          <div className="mt-4">
            <MusicPlayer src={profile.music_url} />
          </div>
        )}
      </div>
    </div>
  );
}

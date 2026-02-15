import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, ExternalLink, Shield } from 'lucide-react';
import { BadgesTab } from '@/components/dashboard/BadgesTab';
import { LinksTab } from '@/components/dashboard/LinksTab';
import { AccountTab } from '@/components/dashboard/AccountTab';
import { DesignTab } from '@/components/dashboard/DesignTab';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  description: string;
  avatar_url: string | null;
  location: string;
  music_url: string | null;
  video_bg_url: string | null;
  custom_cursor_url: string | null;
  display_name_effect: string;
  description_effect: string;
  background_effect: string;
  cursor_effect: string;
  card_color: string;
  discord_user_id: string | null;
  view_count: number;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty('--glow-x', `${e.clientX}px`);
        glowRef.current.style.setProperty('--glow-y', `${e.clientY}px`);
      }
      if (gridRef.current) {
        const cx = (e.clientX / window.innerWidth - 0.5) * 20;
        const cy = (e.clientY / window.innerHeight - 0.5) * 20;
        gridRef.current.style.transform = `perspective(600px) rotateX(${-cy}deg) rotateY(${cx}deg)`;
        gridRef.current.style.backgroundPosition = `${cx * 2}px ${cy * 2}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile(data as Profile);
      });
  }, [user]);

  const refreshProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    if (data) setProfile(data as Profile);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div ref={glowRef} className="min-h-screen bg-background relative cursor-glow-page">
      <div className="cursor-glow pointer-events-none fixed inset-0 z-0" />
      <div ref={gridRef} className="fixed inset-[-20px] z-0 opacity-[0.04] transition-transform duration-200 ease-out" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-200" style={{
        background: 'radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), hsl(var(--primary) / 0.07), transparent 60%)',
      }} />

      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          kenos<span className="text-primary">.lol</span>
        </h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild className="hover-scale">
            <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" /> View page
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut().then(() => navigate('/'))} className="hover-scale">
            <LogOut className="w-4 h-4 mr-1" /> Log out
          </Button>
        </div>
      </nav>

      <main className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-6">Manage your anticheat settings & profile</p>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="bg-secondary mb-6 w-full justify-start">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="cheaters">Detected Cheaters</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <AccountTab profile={profile} onUpdate={refreshProfile} />
          </TabsContent>
          <TabsContent value="links">
            <LinksTab userId={user!.id} />
          </TabsContent>
          <TabsContent value="badges">
            <BadgesTab userId={user!.id} />
          </TabsContent>
          <TabsContent value="design">
            <DesignTab profile={profile} onUpdate={refreshProfile} />
          </TabsContent>
          <TabsContent value="cheaters">
            <div className="glass-card rounded-2xl border border-border p-8 text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Detected Cheaters</h3>
              <p className="text-muted-foreground text-sm">No cheaters detected yet. Run a scan to get started.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

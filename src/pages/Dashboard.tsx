import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, ExternalLink } from 'lucide-react';
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
  background_effect: string;
  cursor_effect: string;
  discord_user_id: string | null;
  view_count: number;
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

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
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border max-w-5xl mx-auto">
        <h2 className="text-xl font-bold text-foreground tracking-tight">
          bio<span className="text-primary">.link</span>
        </h2>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <a href={`/${profile.username}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" /> View page
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut().then(() => navigate('/'))}>
            <LogOut className="w-4 h-4 mr-1" /> Log out
          </Button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-muted-foreground mb-6">Customize your bio-link page</p>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="bg-secondary mb-6 w-full justify-start">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
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
        </Tabs>
      </main>
    </div>
  );
}

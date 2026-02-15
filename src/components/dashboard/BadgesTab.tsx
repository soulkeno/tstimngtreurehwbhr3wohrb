import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Check, Trash2, Shield, Star, Crown, Award, Zap, Heart, Gem, BadgeCheck } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon_url: string;
  is_custom: boolean;
  created_by: string | null;
}

// Premade SVG badge icons
const PREMADE_BADGES = [
  { name: 'Verified', icon: BadgeCheck, color: '#3b82f6' },
  { name: 'VIP', icon: Crown, color: '#eab308' },
  { name: 'OG', icon: Star, color: '#f97316' },
  { name: 'Staff', icon: Shield, color: '#ef4444' },
  { name: 'Developer', icon: Zap, color: '#8b5cf6' },
  { name: 'Supporter', icon: Heart, color: '#ec4899' },
  { name: 'Diamond', icon: Gem, color: '#06b6d4' },
  { name: 'Champion', icon: Award, color: '#22c55e' },
];

function renderPremadeIcon(name: string) {
  const premade = PREMADE_BADGES.find(b => b.name === name);
  if (!premade) return null;
  const Icon = premade.icon;
  return <Icon className="w-6 h-6" style={{ color: premade.color }} />;
}

export function BadgesTab({ userId }: { userId: string }) {
  const [activeBadgeIds, setActiveBadgeIds] = useState<Set<string>>(new Set());
  const [activePremadeNames, setActivePremadeNames] = useState<Set<string>>(new Set());
  const [customBadges, setCustomBadges] = useState<Badge[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const [{ data: userBadges }, { data: allBadges }] = await Promise.all([
      supabase.from('user_badges').select('badge_id, badges(name, icon_url, is_custom, created_by)').eq('user_id', userId),
      supabase.from('badges').select('*').eq('created_by', userId).eq('is_custom', true),
    ]);

    if (userBadges) {
      setActiveBadgeIds(new Set(userBadges.map((b: any) => b.badge_id)));
      const premadeNames = new Set<string>();
      userBadges.forEach((b: any) => {
        if (b.badges && !b.badges.is_custom) premadeNames.add(b.badges.name);
      });
      setActivePremadeNames(premadeNames);
    }
    if (allBadges) setCustomBadges(allBadges as Badge[]);
  };

  useEffect(() => { fetchData(); }, [userId]);

  const togglePremadeBadge = async (premade: typeof PREMADE_BADGES[0]) => {
    if (activePremadeNames.has(premade.name)) {
      // Turn off - find the user's actual user_badge entry for this premade badge
      const { data: userBadges } = await supabase
        .from('user_badges')
        .select('id, badge_id, badges(name, is_custom)')
        .eq('user_id', userId);
      const match = userBadges?.find((ub: any) => ub.badges?.name === premade.name && !ub.badges?.is_custom);
      if (match) {
        const { error } = await supabase.from('user_badges').delete().eq('id', match.id);
        if (error) { console.error('Unequip error:', error); toast.error('Failed to unequip badge'); return; }
      }
    } else {
      // Turn on - ensure badge exists, then equip
      let { data: badge } = await supabase.from('badges').select('id').eq('name', premade.name).eq('is_custom', false).maybeSingle();
      if (!badge) {
        const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${premade.color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${getIconPath(premade.name)}</svg>`;
        const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
        const { data: newBadge, error } = await supabase.from('badges').insert({
          name: premade.name, icon_url: dataUrl, is_custom: false, created_by: userId,
        }).select('id').single();
        if (error) { toast.error('Failed to create badge'); return; }
        badge = newBadge;
      }
      await supabase.from('user_badges').insert({ user_id: userId, badge_id: badge!.id, sort_order: activeBadgeIds.size });
    }
    fetchData();
  };

  const toggleCustomBadge = async (badgeId: string) => {
    if (activeBadgeIds.has(badgeId)) {
      await supabase.from('user_badges').delete().eq('user_id', userId).eq('badge_id', badgeId);
    } else {
      await supabase.from('user_badges').insert({ user_id: userId, badge_id: badgeId, sort_order: activeBadgeIds.size });
    }
    fetchData();
  };

  const deleteBadge = async (badge: Badge) => {
    if (badge.created_by !== userId) { toast.error("You can only delete your own badges"); return; }
    await supabase.from('user_badges').delete().eq('badge_id', badge.id);
    await supabase.from('badges').delete().eq('id', badge.id);
    fetchData();
    toast.success('Badge deleted');
  };

  const uploadBadge = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) { toast.error('Badge must be under 500KB'); return; }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `${userId}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('badges').upload(path, file);
    if (uploadError) { toast.error('Upload failed'); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('badges').getPublicUrl(path);

    const { error: insertError } = await supabase.from('badges').insert({
      name: file.name.replace(/\.[^.]+$/, ''),
      icon_url: publicUrl,
      is_custom: true,
      created_by: userId,
    });

    setUploading(false);
    if (insertError) toast.error('Failed to save badge');
    else { fetchData(); toast.success('Badge uploaded!'); }
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Premade badges - toggle on/off */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Premade Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">Click to equip or unequip a badge.</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {PREMADE_BADGES.map((premade) => {
              const isActive = activePremadeNames.has(premade.name);
              return (
                <button
                  key={premade.name}
                  onClick={() => togglePremadeBadge(premade)}
                  className={`relative flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                    isActive
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary hover:border-primary hover:bg-primary/5'
                  }`}
                  title={premade.name}
                >
                  {renderPremadeIcon(premade.name)}
                  <span className="text-[10px] text-muted-foreground">{premade.name}</span>
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Custom badges */}
      <Card className="glass-card border-border">
        <CardHeader>
          <CardTitle>Your Custom Badges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">Upload and manage your own badges. Only you can see these.</p>

          {customBadges.length > 0 && (
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
              {customBadges.map((badge) => (
                <div key={badge.id} className="relative group">
                  <button
                    onClick={() => toggleCustomBadge(badge.id)}
                    className={`relative w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
                      activeBadgeIds.has(badge.id)
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary hover:border-muted-foreground'
                    }`}
                    title={badge.name}
                  >
                    <img src={badge.icon_url} alt={badge.name} className="w-6 h-6 object-contain" />
                    {activeBadgeIds.has(badge.id) && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                  <button
                    onClick={() => deleteBadge(badge)}
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-destructive rounded-full items-center justify-center hidden group-hover:flex transition-all"
                    title="Delete badge"
                  >
                    <Trash2 className="w-2.5 h-2.5 text-destructive-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border pt-4">
            <Label className="text-sm font-medium block mb-2">Upload custom badge</Label>
            <div className="flex items-center gap-3">
              <Input
                type="file"
                accept="image/png,image/gif,image/webp,image/svg+xml"
                onChange={uploadBadge}
                disabled={uploading}
                className="bg-secondary border-border"
              />
              {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Max 500KB. PNG, GIF, WebP, or SVG.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Simple SVG path data for premade icons
function getIconPath(name: string): string {
  const paths: Record<string, string> = {
    'Verified': '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
    'VIP': '<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5.81 17h12.38v3a1 1 0 0 1-1 1H6.81a1 1 0 0 1-1-1z"/>',
    'OG': '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',
    'Staff': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    'Developer': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    'Supporter': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    'Diamond': '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    'Champion': '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  };
  return paths[name] || '';
}

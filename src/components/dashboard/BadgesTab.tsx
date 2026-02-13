import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Check, Upload } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon_url: string;
  is_custom: boolean;
}

export function BadgesTab({ userId }: { userId: string }) {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [activeBadgeIds, setActiveBadgeIds] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);

  const fetchData = async () => {
    const [{ data: badges }, { data: userBadges }] = await Promise.all([
      supabase.from('badges').select('*'),
      supabase.from('user_badges').select('badge_id').eq('user_id', userId),
    ]);
    if (badges) setAllBadges(badges as Badge[]);
    if (userBadges) setActiveBadgeIds(new Set(userBadges.map((b: any) => b.badge_id)));
  };

  useEffect(() => { fetchData(); }, [userId]);

  const toggleBadge = async (badgeId: string) => {
    if (activeBadgeIds.has(badgeId)) {
      await supabase.from('user_badges').delete().eq('user_id', userId).eq('badge_id', badgeId);
    } else {
      await supabase.from('user_badges').insert({ user_id: userId, badge_id: badgeId, sort_order: activeBadgeIds.size });
    }
    fetchData();
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
    <Card className="glass-card border-border">
      <CardHeader>
        <CardTitle>Badges</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">Select badges to display on your profile next to your name.</p>

        <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
          {allBadges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => toggleBadge(badge.id)}
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
          ))}
        </div>

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
  );
}

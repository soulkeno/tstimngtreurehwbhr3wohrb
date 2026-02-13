import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Trash2, Github, Mail, Globe, MessageCircle, Send, Youtube, Gamepad2, Twitter, Instagram, Music2 } from 'lucide-react';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  discord: <MessageCircle className="w-4 h-4" />,
  github: <Github className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  telegram: <Send className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
  youtube: <Youtube className="w-4 h-4" />,
  roblox: <Gamepad2 className="w-4 h-4" />,
  twitter: <Twitter className="w-4 h-4" />,
  instagram: <Instagram className="w-4 h-4" />,
  tiktok: <Music2 className="w-4 h-4" />,
  custom: <Globe className="w-4 h-4" />,
};

const PLATFORMS = [
  'youtube', 'discord', 'github', 'twitter', 'instagram',
  'tiktok', 'telegram', 'email', 'website', 'roblox', 'custom',
] as const;

interface LinkItem {
  id: string;
  platform: string;
  label: string;
  url: string;
  sort_order: number;
}

export function LinksTab({ userId }: { userId: string }) {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [platform, setPlatform] = useState('custom');
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLinks = async () => {
    const { data } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order');
    if (data) setLinks(data as LinkItem[]);
  };

  useEffect(() => { fetchLinks(); }, [userId]);

  const addLink = async () => {
    if (!url.trim()) { toast.error('URL is required'); return; }
    setLoading(true);
    const { error } = await supabase.from('links').insert({
      user_id: userId,
      platform,
      label: label.slice(0, 50),
      url: url.slice(0, 500),
      sort_order: links.length,
    });
    setLoading(false);
    if (error) toast.error('Failed to add link');
    else {
      setPlatform('custom');
      setLabel('');
      setUrl('');
      fetchLinks();
      toast.success('Link added');
    }
  };

  const removeLink = async (id: string) => {
    await supabase.from('links').delete().eq('id', id);
    fetchLinks();
    toast.success('Link removed');
  };

  return (
    <Card className="glass-card border-border">
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing links */}
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.id} className="flex items-center justify-between bg-secondary rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-foreground">{PLATFORM_ICONS[link.platform] || <Globe className="w-4 h-4" />}</span>
                <div>
                <span className="text-sm font-medium text-foreground capitalize">{link.platform}</span>
                {link.label && <span className="text-muted-foreground text-sm ml-2">— {link.label}</span>}
                <p className="text-xs text-muted-foreground truncate max-w-xs">{link.url}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))}
          {links.length === 0 && <p className="text-muted-foreground text-sm">No links yet</p>}
        </div>

        {/* Add new */}
        <div className="border-t border-border pt-4 space-y-3">
          <h4 className="text-sm font-medium text-foreground">Add new link</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Label</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Optional" className="bg-secondary border-border" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">URL</Label>
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="bg-secondary border-border" />
            </div>
          </div>
          <Button onClick={addLink} disabled={loading} size="sm">
            <Plus className="w-4 h-4 mr-1" /> Add link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

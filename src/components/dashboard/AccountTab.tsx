import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import type { Profile } from '@/pages/Dashboard';

interface Props {
  profile: Profile;
  onUpdate: () => void;
}

export function AccountTab({ profile, onUpdate }: Props) {
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [username, setUsername] = useState(profile.username);
  const [description, setDescription] = useState(profile.description || '');
  const [location, setLocation] = useState(profile.location || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!/^[a-zA-Z0-9_-]+$/.test(username) || username.length < 3) {
      toast.error('Invalid username');
      return;
    }

    setSaving(true);

    // Check username availability if changed
    if (username !== profile.username) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .neq('id', profile.id)
        .maybeSingle();
      if (existing) {
        toast.error('Username is taken');
        setSaving(false);
        return;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.slice(0, 50),
        username: username.toLowerCase().slice(0, 30),
        description: description.slice(0, 300),
        location: location.slice(0, 50),
      })
      .eq('id', profile.id);

    setSaving(false);
    if (error) toast.error('Failed to save');
    else {
      toast.success('Saved!');
      onUpdate();
    }
  };

  return (
    <Card className="glass-card border-border">
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Display Name</Label>
          <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={50} className="bg-secondary border-border" />
        </div>
        <div className="space-y-2">
          <Label>Username (URL)</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm whitespace-nowrap">xyaaa.lol/</span>
            <Input value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} maxLength={30} className="bg-secondary border-border" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} rows={3} className="bg-secondary border-border resize-none" />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} maxLength={50} placeholder="e.g. New York" className="bg-secondary border-border" />
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </CardContent>
    </Card>
  );
}

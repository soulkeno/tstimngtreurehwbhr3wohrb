import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Profile } from '@/pages/Dashboard';

interface Props {
  profile: Profile;
  onUpdate: () => void;
}

const uploadFile = async (bucket: string, userId: string, file: File) => {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);
  return publicUrl;
};

export function DesignTab({ profile, onUpdate }: Props) {
  const [displayNameEffect, setDisplayNameEffect] = useState(profile.display_name_effect);
  const [backgroundEffect, setBackgroundEffect] = useState(profile.background_effect);
  const [cursorEffect, setCursorEffect] = useState(profile.cursor_effect);
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (bucket: string, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20_000_000) { toast.error('File must be under 20MB'); return; }

    try {
      const url = await uploadFile(bucket, profile.user_id, file);
      await supabase.from('profiles').update({ [field]: url }).eq('id', profile.id);
      onUpdate();
      toast.success('Uploaded!');
    } catch {
      toast.error('Upload failed');
    }
    e.target.value = '';
  };

  const saveEffects = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      display_name_effect: displayNameEffect,
      background_effect: backgroundEffect,
      cursor_effect: cursorEffect,
    }).eq('id', profile.id);
    setSaving(false);
    if (error) toast.error('Failed to save');
    else { toast.success('Saved!'); onUpdate(); }
  };

  return (
    <div className="space-y-6">
      {/* File uploads */}
      <Card className="glass-card border-border">
        <CardHeader><CardTitle>Media Uploads</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <Input type="file" accept="image/png,image/gif,image/jpeg,image/webp" onChange={(e) => handleFileUpload('avatars', 'avatar_url', e)} className="bg-secondary border-border" />
            {profile.avatar_url && <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-lg object-cover" />}
          </div>
          <div className="space-y-2">
            <Label>Background Music (MP3)</Label>
            <Input type="file" accept="audio/mpeg,audio/mp3" onChange={(e) => handleFileUpload('music', 'music_url', e)} className="bg-secondary border-border" />
            {profile.music_url && <p className="text-xs text-muted-foreground">✓ Music uploaded</p>}
          </div>
          <div className="space-y-2">
            <Label>Video Background</Label>
            <Input type="file" accept="video/mp4,video/webm,video/ogg" onChange={(e) => handleFileUpload('videos', 'video_bg_url', e)} className="bg-secondary border-border" />
            {profile.video_bg_url && <p className="text-xs text-muted-foreground">✓ Video uploaded</p>}
          </div>
          <div className="space-y-2">
            <Label>Custom Cursor</Label>
            <Input type="file" accept="image/png,image/gif,image/webp,image/x-icon" onChange={(e) => handleFileUpload('cursors', 'custom_cursor_url', e)} className="bg-secondary border-border" />
            {profile.custom_cursor_url && <p className="text-xs text-muted-foreground">✓ Cursor uploaded</p>}
          </div>
        </CardContent>
      </Card>

      {/* Effects */}
      <Card className="glass-card border-border">
        <CardHeader><CardTitle>Visual Effects</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Display Name Effect</Label>
            <Select value={displayNameEffect} onValueChange={setDisplayNameEffect}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="glow">Simple Glow</SelectItem>
                <SelectItem value="butterflies">Butterflies</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Background Effect</Label>
            <Select value={backgroundEffect} onValueChange={setBackgroundEffect}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="blur">Blur</SelectItem>
                <SelectItem value="snowflakes">Snowflakes</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Cursor Effect</Label>
            <Select value={cursorEffect} onValueChange={setCursorEffect}>
              <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="snow">Snow Trail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={saveEffects} disabled={saving}>
            {saving ? 'Saving...' : 'Save effects'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

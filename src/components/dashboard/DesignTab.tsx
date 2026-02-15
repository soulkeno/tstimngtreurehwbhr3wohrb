import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
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

const NAME_EFFECTS = [
  { value: 'none', label: 'None', preview: 'text-foreground' },
  { value: 'glow', label: 'Glow', preview: 'glow-text text-foreground' },
  { value: 'typewriter', label: 'Typewriter', preview: 'text-foreground' },
  { value: 'rainbow', label: 'Rainbow', preview: 'rainbow-text' },
  { value: 'butterflies', label: 'Butterflies', preview: 'text-foreground' },
];

const DESC_EFFECTS = [
  { value: 'none', label: 'None', preview: 'text-muted-foreground' },
  { value: 'glow', label: 'Glow', preview: 'glow-text text-muted-foreground' },
  { value: 'typewriter', label: 'Typewriter', preview: 'text-muted-foreground' },
  { value: 'rainbow', label: 'Rainbow', preview: 'rainbow-text' },
];

const BG_EFFECTS = [
  { value: 'none', label: 'None' },
  { value: 'blur', label: 'Blur' },
  { value: 'snowflakes', label: 'Snowflakes' },
  { value: 'rain', label: 'Rain' },
];

const CURSOR_EFFECTS = [
  { value: 'none', label: 'None' },
  { value: 'snow', label: 'Snow Trail' },
];

function EffectGrid({
  label,
  options,
  value,
  onChange,
  previewText,
}: {
  label: string;
  options: { value: string; label: string; preview?: string }[];
  value: string;
  onChange: (v: string) => void;
  previewText?: string;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`relative rounded-lg border-2 p-3 text-center transition-all text-sm ${
              value === opt.value
                ? 'border-primary bg-primary/10'
                : 'border-border bg-secondary hover:border-muted-foreground'
            }`}
          >
            {previewText && opt.preview ? (
              <span className={`text-xs font-medium ${opt.preview}`}>{previewText}</span>
            ) : (
              <span className="text-xs font-medium text-foreground">{opt.label}</span>
            )}
            <p className="text-[10px] text-muted-foreground mt-1">{opt.label}</p>
            {value === opt.value && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function DesignTab({ profile, onUpdate }: Props) {
  const [displayNameEffect, setDisplayNameEffect] = useState(profile.display_name_effect);
  const [descriptionEffect, setDescriptionEffect] = useState(profile.description_effect || 'none');
  const [backgroundEffect, setBackgroundEffect] = useState(profile.background_effect);
  const [cursorEffect, setCursorEffect] = useState(profile.cursor_effect);
  const [cardColor, setCardColor] = useState(profile.card_color || '#000000');
  const [saving, setSaving] = useState(false);

  const handleFileUpload = async (bucket: string, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100_000_000) { toast.error('File must be under 100MB'); return; }

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
      description_effect: descriptionEffect,
      background_effect: backgroundEffect,
      cursor_effect: cursorEffect,
      card_color: cardColor,
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

      {/* Effects picker */}
      <Card className="glass-card border-border">
        <CardHeader><CardTitle>Visual Effects</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <EffectGrid
            label="Display Name Effect"
            options={NAME_EFFECTS}
            value={displayNameEffect}
            onChange={setDisplayNameEffect}
            previewText={profile.display_name || 'Name'}
          />
          <EffectGrid
            label="Description Effect"
            options={DESC_EFFECTS}
            value={descriptionEffect}
            onChange={setDescriptionEffect}
            previewText="description"
          />
          <EffectGrid
            label="Background Effect"
            options={BG_EFFECTS}
            value={backgroundEffect}
            onChange={setBackgroundEffect}
          />
          <EffectGrid
            label="Cursor Effect"
            options={CURSOR_EFFECTS}
            value={cursorEffect}
            onChange={setCursorEffect}
          />

          {/* Card color picker */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Card Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={cardColor}
                onChange={(e) => setCardColor(e.target.value)}
                className="w-10 h-10 rounded-lg border-2 border-border cursor-pointer bg-transparent"
              />
              <Input
                value={cardColor}
                onChange={(e) => setCardColor(e.target.value)}
                className="bg-secondary border-border w-32 font-mono text-sm"
                placeholder="#000000"
              />
              <div
                className="w-24 h-10 rounded-lg border border-border"
                style={{ backgroundColor: cardColor + 'cc' }}
              />
            </div>
            <p className="text-xs text-muted-foreground">Sets the background color of your profile card (keeps transparency).</p>
          </div>
          <Button onClick={saveEffects} disabled={saving}>
            {saving ? 'Saving...' : 'Save effects'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

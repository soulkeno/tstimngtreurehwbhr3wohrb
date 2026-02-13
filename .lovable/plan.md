

# Bio-Link Platform — Full-Stack Build Plan

## Overview
A customizable bio-link website where users sign up, pick a username (which becomes their public URL), and fully customize their profile page with badges, links, music, video backgrounds, particle effects, cursor effects, and more — inspired by the reference screenshots (dark aesthetic, card-based layout with 3D hover).

---

## 1. Landing / Home Page
- Dark-themed marketing page showcasing the platform
- "Sign Up" and "Login" buttons
- Brief feature showcase (example bio-link previews)

## 2. Authentication (Supabase)
- **Sign up** with email, password, and **unique username** (validated for availability)
- **Login** with email & password
- Username is locked to the public URL path: `yoursite.com/username`
- Profiles table storing: display name, username (URL slug), description, avatar URL, and all customization settings

## 3. Public Bio-Link Page (`/:username`)
A dark, card-based profile page matching the reference screenshots:

- **Profile picture** (top-left, with optional label like "Easter 2025")
- **View counter** (real, tracked per visit) and **location tag**
- **Display name** with **custom badge icons** displayed inline next to it
- **Description / status text** below the name
- **Social link icons** row (Discord, GitHub, Email, Telegram, Globe, etc.)
- **Discord activity card** — live integration showing current Discord status/activity via Discord API
- **Music player** — plays uploaded MP3 with album art, progress bar, play/pause/skip controls
- **3D tilt hover effect** on the entire card, following the cursor

### Visual Effects (applied per-user settings):
- Video background (MP4) or static background
- Background effects: blur, snowflakes (falling down), rain (diagonal), particles
- Display name effects: glow, butterflies surrounding the name
- Custom cursor image
- Cursor trail effects: snowflakes following cursor and falling

## 4. Dashboard (Authenticated)
Tabbed interface with the following sections:

### Tab: Badges
- Grid of **custom-designed icon badges** (not emojis — unique SVG/icon badges)
- Toggle badges on/off to display on your profile
- **Upload custom badge** option (image upload, resized to badge dimensions)

### Tab: Links
- Add/remove/reorder social links
- **Popular platforms** with pre-set icons: YouTube, Roblox, Discord, GitHub, Twitter/X, Instagram, TikTok, Telegram, Email, Website
- **Custom URL** option with custom label and optional icon
- Each link is displayed as an icon on the public profile

### Tab: Account Information
- Edit **Display Name**
- Edit **URL/Username** (with availability check)
- Edit **Description/Bio**

### Tab: Design
- **Profile Picture** upload (PNG, GIF, JPG, WEBP)
- **Background Music** upload (MP3) — plays on the public profile
- **Video Background** upload (MP4 and other video formats)
- **Custom Cursor** upload (image file for cursor)
- **Display Name Effects** selector: None, Simple Glow, Butterflies
- **Background Effects** selector: None, Blur, Snowflakes, Rain (diagonal)
- **Cursor Effects** selector: None, Snow trail
- Live preview of settings

## 5. Backend & Storage (Supabase / Lovable Cloud)
- **Auth**: Supabase authentication (email/password)
- **Database**: Profiles, badges, links, design settings, view tracking
- **File Storage**: Supabase Storage buckets for avatars, music, video backgrounds, custom badges, custom cursors
- **Edge Function**: Discord API integration for live status
- **View Tracking**: Real page view counter per profile

## 6. Key Technical Highlights
- 3D card tilt effect using CSS transforms + mouse tracking
- Canvas/CSS particle systems for snow, rain, butterflies, glow
- Custom cursor via CSS `cursor: url(...)`
- Cursor trail effect via JS animation
- HTML5 audio player for MP3 playback with custom UI
- HTML5 video element for background videos
- Discord API integration via edge function for live activity status


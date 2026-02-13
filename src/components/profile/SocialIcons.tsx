import { Github, Mail, Globe, MessageCircle, Send, Youtube, Gamepad2, Twitter, Instagram, Music2 } from 'lucide-react';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  discord: <MessageCircle className="w-6 h-6" />,
  github: <Github className="w-6 h-6" />,
  email: <Mail className="w-6 h-6" />,
  telegram: <Send className="w-6 h-6" />,
  website: <Globe className="w-6 h-6" />,
  youtube: <Youtube className="w-6 h-6" />,
  roblox: <Gamepad2 className="w-6 h-6" />,
  twitter: <Twitter className="w-6 h-6" />,
  instagram: <Instagram className="w-6 h-6" />,
  tiktok: <Music2 className="w-6 h-6" />,
};

interface Link {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon_url?: string | null;
}

export function SocialIcons({ links }: { links: Link[] }) {
  return (
    <div className="flex items-center gap-4 py-3">
      {links.map((link) => {
        const href = link.platform === 'email' ? `mailto:${link.url}` : link.url;
        return (
          <a
            key={link.id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={link.label || link.platform}
            className="text-foreground hover:text-primary transition-all duration-200 hover:scale-110"
          >
            {link.icon_url ? (
              <img src={link.icon_url} alt={link.label || link.platform} className="w-6 h-6 object-contain" />
            ) : (
              PLATFORM_ICONS[link.platform] || <Globe className="w-6 h-6" />
            )}
          </a>
        );
      })}
    </div>
  );
}

import { Github, Mail, Globe, MessageCircle, Send } from 'lucide-react';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  discord: <MessageCircle className="w-6 h-6" />,
  github: <Github className="w-6 h-6" />,
  email: <Mail className="w-6 h-6" />,
  telegram: <Send className="w-6 h-6" />,
  website: <Globe className="w-6 h-6" />,
};

interface Link {
  id: string;
  platform: string;
  label: string;
  url: string;
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
            className="text-foreground hover:text-primary transition-colors"
          >
            {PLATFORM_ICONS[link.platform] || <Globe className="w-6 h-6" />}
          </a>
        );
      })}
    </div>
  );
}

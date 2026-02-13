import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Link2, Palette, Shield } from 'lucide-react';

const features = [
  { icon: Link2, title: 'Custom Links', desc: 'All your socials in one beautiful page' },
  { icon: Palette, title: 'Full Customization', desc: 'Particles, video backgrounds, custom cursors & more' },
  { icon: Sparkles, title: 'Unique Badges', desc: 'Stand out with custom icon badges on your profile' },
  { icon: Shield, title: 'Your Username, Your URL', desc: 'Claim your unique link: yoursite.com/you' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            bio<span className="text-primary">.link</span>
          </h2>
          <div className="flex gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </nav>

        <section className="relative z-10 text-center px-6 pt-20 pb-32 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Your digital identity,{' '}
            <span className="text-primary glow-text">redefined</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Build a stunning bio-link page with 3D effects, music, video backgrounds, custom badges, and more.
          </p>
          <Button size="lg" className="text-base px-8 py-6" asChild>
            <Link to="/signup">Claim your page →</Link>
          </Button>
        </section>
      </header>

      {/* Features */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors">
              <f.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-muted-foreground text-sm border-t border-border">
        © 2025 bio.link — All rights reserved
      </footer>
    </div>
  );
}

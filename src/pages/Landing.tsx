import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Link2, Palette, Shield } from 'lucide-react';

const features = [
  { icon: Link2, title: 'One Link, Everything', desc: 'Drop all your socials, music, whatever — one page.' },
  { icon: Palette, title: 'Make It Yours', desc: 'Snow, rain, video backgrounds, custom cursors. Go crazy.' },
  { icon: Sparkles, title: 'Flex Your Badges', desc: 'Verified, VIP, OG — collect and show off icons on your profile.' },
  { icon: Shield, title: 'Your Name, Your Link', desc: 'Grab kenos.lol/yourname before someone else does.' },
];

export default function Landing() {
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.setProperty('--glow-x', `${e.clientX}px`);
        glowRef.current.style.setProperty('--glow-y', `${e.clientY}px`);
      }
      if (gridRef.current) {
        const cx = (e.clientX / window.innerWidth - 0.5) * 20;
        const cy = (e.clientY / window.innerHeight - 0.5) * 20;
        gridRef.current.style.transform = `perspective(600px) rotateX(${-cy}deg) rotateY(${cx}deg)`;
        gridRef.current.style.backgroundPosition = `${cx * 2}px ${cy * 2}px`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={glowRef} className="min-h-screen bg-background relative cursor-glow-page">
      {/* Cursor glow */}
      <div className="cursor-glow pointer-events-none fixed inset-0 z-0" />

      {/* Grid overlay */}
      <div ref={gridRef} className="fixed inset-[-20px] z-0 opacity-[0.04] transition-transform duration-200 ease-out" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Hero */}
      <header className="relative z-10">
        <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-foreground tracking-tight animate-fade-in">
            kenos<span className="text-primary">.lol</span>
          </h2>
          <div className="flex gap-3">
            <Button variant="ghost" asChild className="hover-scale transition-all duration-300 hover:text-primary">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="hover-scale btn-glow transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </nav>

        <section className="text-center px-6 pt-24 pb-36 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-8 animate-fade-in hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 cursor-default">
            <Sparkles className="w-4 h-4 animate-pulse" />
            kenos.lol
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight animate-fade-in">
            kenos<span className="text-primary glow-text">.lol</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Share your links with anyone, for free and awesome designs.
          </p>
          <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="text-base px-8 py-6 btn-glow hover-scale transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.6)] active:scale-95" asChild>
              <Link to="/signup">get started →</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 hover-scale transition-all duration-300 hover:border-primary/60 hover:text-primary active:scale-95" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </section>
      </header>

      {/* Features */}
      <section className="relative z-10 px-6 py-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="relative rounded-xl border border-border bg-card/60 p-6 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.15)] animate-fade-in overflow-hidden group"
              style={{ animationDelay: `${0.1 * i}s` }}
            >
              {/* Left glow accent */}
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/60 via-primary/20 to-transparent rounded-l-xl opacity-60 group-hover:opacity-100 transition-all duration-300" />

              <div className="w-10 h-10 rounded-lg border border-primary/30 bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                <f.icon className="w-5 h-5 text-primary group-hover:drop-shadow-[0_0_6px_hsl(var(--primary)/0.6)] transition-all duration-300" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 text-center py-10 text-muted-foreground text-sm border-t border-border">
        © 2025 kenos.lol — All rights reserved
      </footer>
    </div>
  );
}

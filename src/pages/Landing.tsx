import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Crosshair, Code2, Terminal, ArrowRight, Pencil,
  Zap, Shield, Clock, Users, BookOpen, Lock,
  ChevronDown, ExternalLink, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

/* ========== DATA ========== */
const tools = [
  {
    icon: Crosshair,
    title: 'MCTiers Queue Sniper',
    desc: 'snipe the MCTiers queue as FAST as you can, easy to setup with tutorial.',
    href: '/queue-sniper',
    tag: 'NEW',
  },
  {
    icon: Pencil,
    title: "sakn's edits",
    desc: "check out sakn's edits, clean and creative.",
    href: 'https://sakn.lol',
    tag: 'NEW',
    external: true,
  },
  {
    icon: Code2,
    title: 'More Tools',
    desc: 'more tools coming soon. stay tuned.',
    href: '#',
    tag: 'SOON',
    disabled: true,
  },
];

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'every tool is optimized for speed, no bloat, no lag.' },
  { icon: Shield, title: 'Reliable', desc: 'built to work every single time without fail.' },
  { icon: Clock, title: 'Quick Setup', desc: 'get running in under a minute with simple instructions.' },
  { icon: Users, title: 'Community Driven', desc: 'tools built based on what the community actually needs.' },
  { icon: BookOpen, title: 'Documented', desc: 'clear tutorials and guides for every tool available.' },
  { icon: Lock, title: 'Open & Transparent', desc: 'no hidden stuff, what you see is what you get.' },
];

const faqs = [
  { q: 'what tools are available?', a: 'currently we have the MCTiers Queue Sniper and more tools are being developed. stay tuned for updates.' },
  { q: 'are the tools free?', a: 'yes, all tools are completely free to use. no hidden costs or subscriptions.' },
  { q: 'how do i report a bug?', a: 'you can reach out through discord or create an issue. we respond quickly.' },
  { q: 'will there be more tools?', a: 'absolutely. new tools are actively being developed and will be released regularly.' },
];

const codeShowcase = `{
  "tool": "queue-sniper",
  "version": "1.0",
  "config": {
    "target": "join queue",
    "method": "MutationObserver",
    "speed": "requestAnimationFrame",
    "auto_click": true
  },
  "status": "active",
  "created_by": "@wbu5",
  "features": [
    "instant detection",
    "auto-click",
    "zero delay"
  ]
}`;

/* ========== MESH GRADIENT BG ========== */
function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const time = useRef(0);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const blobs = [
      { x: 0.3, y: 0.2, r: 400, hue: 265, sat: 70, light: 50, speed: 0.0003, phase: 0 },
      { x: 0.7, y: 0.6, r: 350, hue: 280, sat: 60, light: 40, speed: 0.0004, phase: 2 },
      { x: 0.5, y: 0.8, r: 300, hue: 250, sat: 80, light: 45, speed: 0.0005, phase: 4 },
      { x: 0.2, y: 0.7, r: 280, hue: 270, sat: 50, light: 35, speed: 0.0002, phase: 1 },
    ];

    const draw = () => {
      time.current += 1;
      ctx.fillStyle = 'hsl(260, 20%, 5%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      blobs.forEach(b => {
        const cx = canvas.width * (b.x + 0.1 * Math.sin(time.current * b.speed + b.phase));
        const cy = canvas.height * (b.y + 0.1 * Math.cos(time.current * b.speed * 1.3 + b.phase));
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
        gradient.addColorStop(0, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0.12)`);
        gradient.addColorStop(1, `hsla(${b.hue}, ${b.sat}%, ${b.light}%, 0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
}

/* ========== WAVY TEXT ========== */
function WavyText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 80, rotateX: -90, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
          transition={{ delay: delay + i * 0.04, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 1000, display: char === ' ' ? 'inline' : 'inline-block', width: char === ' ' ? '0.25em' : 'auto' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ========== REVEAL ========== */
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ========== GLOW CARD (with cursor glow + tilt + scale) ========== */
function GlowCard({ children, className, disabled }: { children: React.ReactNode; className?: string; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (disabled) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(py * -14);
    rotateY.set(px * 14);
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovering(false);
  };

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMove}
      onMouseEnter={() => !disabled && setHovering(true)}
      onMouseLeave={handleLeave}
      whileHover={disabled ? {} : { scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* cursor glow */}
      {hovering && (
        <div
          className="pointer-events-none absolute z-0 w-[300px] h-[300px] rounded-full transition-opacity duration-300"
          style={{
            left: glowPos.x - 150,
            top: glowPos.y - 150,
            background: 'radial-gradient(circle, hsla(265, 80%, 65%, 0.15) 0%, transparent 70%)',
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

/* ========== TOOL CARD ========== */
function ToolCard({ icon: Icon, title, desc, href, tag, disabled, external }: typeof tools[number]) {
  const inner = (
    <GlowCard
      disabled={disabled}
      className={`h-full border border-border/40 bg-card/20 backdrop-blur-md transition-colors duration-500 ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:border-primary/50 cursor-pointer'}`}
    >
      {/* shimmer top line */}
      <div className="absolute top-0 inset-x-0 h-px z-10">
        <div className="h-full w-1/2 mx-auto bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      <div className="p-8 relative z-10 group">
        <div className="flex items-start justify-between mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_30px_hsl(265,80%,65%,0.15)] transition-all duration-500">
            <Icon className="w-6 h-6 text-primary/70 group-hover:text-primary transition-colors duration-300" />
          </div>
          {tag && (
            <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full ${
              tag === 'NEW' ? 'text-primary bg-primary/10 border border-primary/20' : 'text-muted-foreground bg-muted/30 border border-border/30'
            }`}>
              {tag}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6">{desc}</p>
        {!disabled && (
          <div className="flex items-center gap-2 text-primary/60 group-hover:text-primary text-sm font-medium transition-all duration-300">
            {external ? <><span>visit</span><ExternalLink className="w-3.5 h-3.5" /></> : <><span>open tool</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></>}
          </div>
        )}
      </div>
    </GlowCard>
  );

  if (disabled) return inner;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className="h-full block">{inner}</a>;
  return <Link to={href} className="h-full block">{inner}</Link>;
}

/* ========== FAQ ========== */
function FaqItem({ q, a }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/20 last:border-b-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-6 text-left group">
        <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <p className="text-sm text-muted-foreground leading-relaxed pb-6">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========== CODE SHOWCASE (tilted) ========== */
function CodeShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80, rotateY: -15 }}
      animate={{ opacity: 1, x: 0, rotateY: -8 }}
      transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative hidden lg:block"
      style={{ perspective: 1200 }}
    >
      <div
        className="relative w-[480px] rounded-2xl border border-border/30 bg-card/40 backdrop-blur-xl shadow-2xl shadow-primary/10 overflow-hidden"
        style={{ transform: 'rotateY(-6deg) rotateX(2deg)' }}
      >
        {/* window bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20 bg-card/60">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-3 text-[10px] text-muted-foreground font-mono">config.json</span>
        </div>
        {/* code */}
        <div className="p-5 font-mono text-[11px] leading-relaxed text-muted-foreground overflow-hidden max-h-[360px]">
          <pre className="whitespace-pre-wrap">
            {codeShowcase.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="w-6 text-right mr-4 text-muted-foreground/30 select-none text-[10px]">{i + 1}</span>
                <span>
                  {line.replace(/"([^"]+)":/g, (_, k) => `"${k}":`).split(/(["'][^"']*["']|true|false|null|\d+)/g).map((part, j) => {
                    if (/^["']/.test(part) && part.includes(':')) return <span key={j} className="text-primary/80">{part}</span>;
                    if (/^["']/.test(part)) return <span key={j} className="text-green-400/70">{part}</span>;
                    if (/^(true|false|null)$/.test(part)) return <span key={j} className="text-yellow-400/70">{part}</span>;
                    if (/^\d+$/.test(part)) return <span key={j} className="text-orange-400/70">{part}</span>;
                    return <span key={j}>{part}</span>;
                  })}
                </span>
              </div>
            ))}
          </pre>
        </div>
        {/* glow */}
        <div className="absolute -bottom-20 -right-20 w-[200px] h-[200px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      </div>
    </motion.div>
  );
}

/* ========== MAIN ========== */
export default function Landing() {
  return (
    <div className="min-h-screen bg-background relative">
      <MeshBackground />

      {/* noise overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundRepeat: 'repeat', backgroundSize: '128px' }} />

      {/* nav */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl bg-background/40 border-b border-border/10"
      >
        <div className="flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
              <Terminal className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm text-foreground tracking-tight">keno's tools</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {['tools', 'features', 'faq'].map(s => (
              <a key={s} href={`#${s}`} className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wide capitalize">{s}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs h-8 text-muted-foreground" asChild>
              <Link to="/login">login</Link>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 px-5 rounded-lg shadow-lg shadow-primary/25" asChild>
              <Link to="/signup">sign up</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 min-h-screen flex items-center px-6 md:px-10">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-16">
          {/* left: text */}
          <div className="flex-1 max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/15 text-primary text-[11px] font-medium tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                free & open tools
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.85]">
              <WavyText text="pick ur" delay={0.3} />
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] mt-1">
              <WavyText text="tool" className="text-primary" delay={0.65} />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-8 text-muted-foreground text-sm md:text-base max-w-md leading-relaxed"
            >
              tools made by <span className="text-foreground font-medium">@wbu5</span>, fast, simple, and free.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="mt-8 flex gap-4"
            >
              <a
                href="#tools"
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:brightness-110 transition-all duration-300 active:scale-[0.97]"
              >
                explore
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* right: tilted code showcase */}
          <CodeShowcase />
        </div>
      </section>

      {/* ===== TOOLS ===== */}
      <section id="tools" className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <Reveal className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/70 block mb-3">tools</span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            what we've <span className="text-primary">got</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {tools.map((tool, i) => (
            <Reveal key={tool.title} delay={i * 0.1}>
              <ToolCard {...tool} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 py-32">
        <Reveal className="text-center mb-16">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/70 block mb-3">why us</span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            built <span className="text-primary">right</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <GlowCard className="h-full border border-border/20 bg-card/10 backdrop-blur-sm hover:border-primary/20 transition-colors duration-500 rounded-xl cursor-default">
                <div className="p-7 relative z-10 group">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary/15 group-hover:shadow-[0_0_20px_hsl(265,80%,65%,0.1)] transition-all duration-500">
                    <f.icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="relative z-10 max-w-2xl mx-auto px-6 py-32">
        <Reveal className="text-center mb-12">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/70 block mb-3">faq</span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            questions<span className="text-primary">?</span>
          </h2>
        </Reveal>

        <Reveal>
          <div className="border border-border/20 rounded-xl bg-card/10 backdrop-blur-sm px-8">
            {faqs.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-border/10 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Terminal className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">keno's tools</span>
          </div>
          <span className="text-[11px] text-muted-foreground/40">keno's tools made by @wbu5</span>
        </div>
      </footer>
    </div>
  );
}

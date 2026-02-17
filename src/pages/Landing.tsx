import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Crosshair, Code2, Terminal, ArrowRight, Pencil, Play,
  Zap, Shield, Clock, Users, BookOpen, Lock,
  ChevronDown, ExternalLink, Sparkles, MousePointerClick,
} from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

/* ========== DATA ========== */
const tools = [
  {
    icon: Crosshair,
    title: 'MCTiers Queue Sniper',
    desc: 'snipe the MCTiers queue as FAST as you can, easy to setup with tutorial.',
    href: '/queue-sniper',
    tag: 'NEW',
    gradient: 'from-primary/20 to-primary/5',
  },
  {
    icon: Pencil,
    title: "sakn's edits",
    desc: "check out sakn's edits, clean and creative.",
    href: 'https://sakn.lol',
    tag: 'NEW',
    external: true,
    gradient: 'from-purple-500/20 to-violet-500/5',
  },
  {
    icon: Code2,
    title: 'More Tools',
    desc: 'more tools coming soon. stay tuned.',
    href: '#',
    tag: 'SOON',
    disabled: true,
    gradient: 'from-muted/30 to-muted/10',
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

/* ========== ANIMATIONS ========== */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ========== PARTICLE FIELD ========== */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    // init particles
    const count = Math.min(80, Math.floor(window.innerWidth / 20));
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        // mouse repulsion
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.15;
          p.vy += (dy / dist) * force * 0.15;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        // wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(265, 80%, 65%, ${p.alpha})`;
        ctx.fill();
      });

      // draw connections
      particles.current.forEach((a, i) => {
        particles.current.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(265, 80%, 65%, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

/* ========== MAGNETIC BUTTON ========== */
function MagneticButton({ children, className, ...props }: React.ComponentProps<typeof motion.a>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.a
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
      {...props}
    >
      {children}
    </motion.a>
  );
}

/* ========== GLITCH TEXT ========== */
function GlitchText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <span className="absolute inset-0 text-primary/30 animate-pulse" style={{ clipPath: 'inset(20% 0 30% 0)', transform: 'translateX(2px)' }}>{text}</span>
    </span>
  );
}

/* ========== WAVY TEXT ========== */
function WavyText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 60, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: delay + i * 0.03, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 800, display: char === ' ' ? 'inline' : 'inline-block', width: char === ' ' ? '0.3em' : 'auto' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

/* ========== FAQ ITEM ========== */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={fadeUp}
      className="border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-colors duration-300"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-primary/50">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{q}</span>
        </div>
        <div className={`w-6 h-6 border border-border flex items-center justify-center transition-all duration-300 ${open ? 'bg-primary border-primary rotate-180' : ''}`}>
          <ChevronDown className={`w-3 h-3 ${open ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pl-14">
              <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ========== TOOL CARD ========== */
function ToolCard({
  icon: Icon, title, desc, href, tag, disabled, external, gradient,
}: {
  icon: React.ElementType; title: string; desc: string; href: string;
  tag?: string; disabled?: boolean; external?: boolean; gradient?: string;
}) {
  const content = (
    <div className={`group relative bg-card/50 backdrop-blur-sm border border-border/50 p-8 transition-all duration-500 h-full overflow-hidden ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:border-primary/40 hover:bg-card/80 cursor-pointer'}`}>
      {/* gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* glow line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/60 transition-all duration-700" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 border border-border/50 bg-muted/30 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all duration-300">
            <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
          </div>
          {tag && (
            <span className={`text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1 border ${
              tag === 'NEW' ? 'text-primary border-primary/30 bg-primary/5' : 'text-muted-foreground border-border/50'
            }`}>
              {tag}
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
        <p className="text-muted-foreground text-xs leading-relaxed mb-6">{desc}</p>
        {!disabled && (
          <div className="flex items-center gap-2 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            {external ? <><span>Visit</span><ExternalLink className="w-3 h-3" /></> : <><span>Open Tool</span><ArrowRight className="w-3 h-3" /></>}
          </div>
        )}
      </div>
    </div>
  );

  if (disabled) return content;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className="h-full block">{content}</a>;
  return <Link to={href} className="h-full block">{content}</Link>;
}

/* ========== STAT COUNTER ========== */
function StatNumber({ value, label }: { value: string; label: string }) {
  return (
    <motion.div variants={fadeUp} className="text-center">
      <div className="text-3xl md:text-4xl font-black text-foreground mb-1">{value}</div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
    </motion.div>
  );
}

/* ========== MAIN COMPONENT ========== */
export default function Landing() {
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleField />

      {/* ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-[-30%] left-[50%] -translate-x-1/2 w-[1200px] h-[600px] bg-primary/[0.06] blur-[200px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-primary/[0.04] blur-[180px] rounded-full" />
      </div>

      {/* ===== NAV ===== */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/30"
      >
        <div className="flex items-center justify-between px-6 py-3.5 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Terminal className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground tracking-tight leading-none">keno's tools</span>
              <span className="text-[9px] text-muted-foreground tracking-wider uppercase">by @wbu5</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Home', to: '/' },
              { label: 'Tools', to: '#tools' },
              { label: 'Features', to: '#features' },
              { label: 'FAQ', to: '#faq' },
            ].map(link => (
              <a
                key={link.label}
                href={link.to.startsWith('#') ? link.to : undefined}
                className="text-xs tracking-wide text-muted-foreground hover:text-foreground px-4 py-2 transition-colors cursor-pointer"
              >
                {link.to.startsWith('#') ? link.label : <Link to={link.to} className="text-inherit">{link.label}</Link>}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs h-8" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8 px-4 shadow-lg shadow-primary/20" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-36 md:pt-48 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-2 mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" />
            v2.0 live
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.9] mb-2">
          <WavyText text="the most" delay={0.5} />
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-2">
          <WavyText text="powerful" className="text-primary" delay={0.9} />
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-[0.9] mb-10">
          <WavyText text="toolbox." delay={1.3} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed mb-12"
        >
          a curated collection of tools designed for speed and simplicity.
          built with care by <span className="text-foreground font-medium">@wbu5</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="flex flex-wrap items-center gap-4"
        >
          <MagneticButton
            href="#tools"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground text-sm font-bold overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_hsl(265,80%,65%,0.35)] active:scale-[0.97]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <MousePointerClick className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Explore Tools</span>
          </MagneticButton>

          <MagneticButton
            href="#features"
            className="group inline-flex items-center gap-3 px-8 py-4 border border-border/60 text-foreground text-sm font-medium hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </motion.div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          className="grid grid-cols-3 border border-border/40 bg-card/20 backdrop-blur-sm divide-x divide-border/40 py-8"
        >
          <StatNumber value="3+" label="Tools" />
          <StatNumber value="100%" label="Free" />
          <StatNumber value="24/7" label="Available" />
        </motion.div>
      </section>

      {/* ===== TOOLS ===== */}
      <section id="tools" className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-primary" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Available Tools</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-3">
            pick your <span className="text-primary">weapon</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground max-w-md">choose from the collection and get started instantly.</motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {tools.map((tool) => (
            <motion.div key={tool.title} variants={fadeUp}>
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-primary" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">Why Us</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-3">
            built <span className="text-primary">different</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground max-w-md">every detail is crafted for the best experience.</motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="group relative bg-card/30 backdrop-blur-sm border border-border/30 p-7 hover:border-primary/30 hover:bg-card/60 transition-all duration-500"
            >
              <div className="absolute top-0 left-0 w-12 h-px bg-primary/0 group-hover:bg-primary/60 transition-all duration-500" />
              <div className="w-10 h-10 border border-border/50 flex items-center justify-center mb-5 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                <f.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 py-28">
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-primary" />
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary">FAQ</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-3">
            got <span className="text-primary">questions?</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground">we got answers.</motion.p>
        </motion.div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-3"
        >
          {faqs.map((f, i) => (
            <FaqItem key={f.q} q={f.q} a={f.a} index={i} />
          ))}
        </motion.div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative border border-border/40 bg-card/30 backdrop-blur-sm p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-primary/[0.03]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative z-10">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight mb-4">
              ready to <span className="text-primary">start?</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-10 max-w-md mx-auto">all tools are free. no signups required. just pick one and go.</p>
            <MagneticButton
              href="#tools"
              className="group relative inline-flex items-center gap-3 px-10 py-4 bg-primary text-primary-foreground text-sm font-bold overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_hsl(265,80%,65%,0.4)] active:scale-[0.97]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-border/30 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Terminal className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">keno's tools</span>
          </div>
          <span className="text-[11px] text-muted-foreground/50">© 2025 keno — all rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

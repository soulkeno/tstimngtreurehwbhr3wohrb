import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Crosshair, Code2, Terminal, ArrowRight, Pencil, Play,
  Zap, Shield, Clock, Users, BookOpen, Lock,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

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

const steps = [
  { num: '01', title: 'Browse', desc: 'explore the collection of tools and find what you need.' },
  { num: '02', title: 'Setup', desc: 'follow the simple guide to get started in seconds.' },
  { num: '03', title: 'Use', desc: 'run the tool and let it do the work for you.' },
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
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ========== WAVY TEXT ========== */
function WavyText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 50, rotateX: -50 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: delay + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: 600 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ========== INTERACTIVE GRID ========== */
function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  const onMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);

    const gap = 48;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cols = Math.ceil(canvas.width / gap);
      const rows = Math.ceil(canvas.height / gap);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * gap + gap / 2;
          const y = r * gap + gap / 2;
          const dx = x - mouse.current.x;
          const dy = y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const proximity = Math.max(0, 1 - dist / 160);
          ctx.beginPath();
          ctx.arc(x, y, 1 + proximity * 3, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(265, 80%, 65%, ${0.06 + proximity * 0.4})`;
          ctx.fill();
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, [onMove]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

/* ========== FAQ ITEM ========== */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
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
            <p className="text-xs text-muted-foreground pb-5 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========== MAIN COMPONENT ========== */
export default function Landing() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <InteractiveGrid />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-[-20%] right-[10%] w-[800px] h-[800px] bg-primary/[0.07] blur-[180px]" />
        <div className="absolute top-[30%] left-[-5%] w-[500px] h-[500px] bg-primary/[0.04] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[30%] w-[600px] h-[400px] bg-primary/[0.05] blur-[150px]" />
      </div>

      {/* ===== NAV ===== */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground tracking-tight">keno's tools</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }} className="hidden md:flex items-center gap-8">
          {[
            { label: 'Home', to: '/' },
            { label: 'Features', to: '#features' },
            { label: 'FAQ', to: '#faq' },
            { label: 'Queue Sniper', to: '/queue-sniper' },
          ].map(link => (
            <a
              key={link.label}
              href={link.to.startsWith('#') ? link.to : undefined}
              onClick={link.to.startsWith('#') ? undefined : undefined}
              className={`text-xs tracking-wide uppercase transition-colors cursor-pointer ${
                !link.to.startsWith('#') && location.pathname === link.to ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.to.startsWith('#') ? link.label : <Link to={link.to} className="text-inherit">{link.label}</Link>}
            </a>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-none text-xs" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" className="rounded-none bg-primary text-primary-foreground hover:bg-primary/90 text-xs" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </motion.div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-28 md:pt-40 pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-8 border border-primary/20"
        >
          <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
          UPDATE
        </motion.div>

        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-foreground leading-[0.95] mb-4">
          <WavyText text="most" delay={0.1} />
          <WavyText text="powerful" className="text-primary" delay={0.35} />
        </h1>
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-foreground leading-[0.95] mb-8">
          <WavyText text="tool collection" delay={0.6} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-sm text-muted-foreground max-w-lg leading-relaxed mb-12"
        >
          experience a collection of tools designed with quality and speed in mind. simple, fast and effective, built with care by @wbu5.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="flex items-center gap-4"
        >
          <a
            href="#tools"
            className="group relative inline-flex items-center gap-2.5 px-7 py-3 bg-primary text-primary-foreground text-sm font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_hsl(265,80%,65%,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <Play className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">Start</span>
          </a>
          <a
            href="#features"
            className="inline-flex items-center gap-2 px-5 py-3 border border-border text-foreground text-sm font-medium hover:bg-accent transition-colors"
          >
            Learn More
          </a>
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[10px] font-bold tracking-widest uppercase text-primary mb-3">Why Choose Us</motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            see <span className="text-primary">why</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground max-w-md mx-auto">discover the key features of keno's tools</motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-px bg-border"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp} className="group bg-card p-8 hover:bg-accent transition-all duration-300">
              <f.icon className="w-5 h-5 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== TOOLS ===== */}
      <section id="tools" className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[10px] font-bold tracking-widest uppercase text-primary mb-3">Available Tools</motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            choose a <span className="text-primary">tool</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground max-w-md mx-auto">pick what you need from the collection.</motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-px bg-border"
        >
          {tools.map((tool) => (
            <motion.div key={tool.title} variants={fadeUp}>
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[10px] font-bold tracking-widest uppercase text-primary mb-3">How It Works</motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight">
            3 simple <span className="text-primary">steps</span>
          </motion.h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {steps.map((s) => (
            <motion.div key={s.num} variants={fadeUp} className="group relative border border-border bg-card p-8 hover:border-primary/30 transition-all duration-300">
              <span className="text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors absolute top-4 right-6">{s.num}</span>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="relative z-10 max-w-3xl mx-auto px-6 py-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} className="text-[10px] font-bold tracking-widest uppercase text-primary mb-3">FAQ</motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            answer your <span className="text-primary">questions</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sm text-muted-foreground">you've got answers</motion.p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {faqs.map((f) => (
            <motion.div key={f.q} variants={fadeUp}>
              <FaqItem q={f.q} a={f.a} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative border border-border bg-card p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-primary/[0.04]" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
              start using <span className="text-primary">tools</span> now
            </h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">join and get access to all tools for free. no signups required for most tools.</p>
            <a
              href="#tools"
              className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 bg-primary text-primary-foreground text-sm font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_0_50px_hsl(265,80%,65%,0.4)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <span className="relative z-10">Get Started</span>
              <ArrowRight className="w-4 h-4 relative z-10" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-muted-foreground text-[11px] tracking-wide">
        © 2025 keno — all rights reserved.
      </footer>
    </div>
  );
}

/* ========== TOOL CARD ========== */
function ToolCard({
  icon: Icon,
  title,
  desc,
  href,
  tag,
  disabled,
  external,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  href: string;
  tag?: string;
  disabled?: boolean;
  external?: boolean;
}) {
  const content = (
    <div className={`group bg-card p-7 transition-all duration-300 h-full ${disabled ? 'opacity-35 cursor-not-allowed' : 'hover:bg-accent cursor-pointer'}`}>
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 bg-muted flex items-center justify-center group-hover:bg-primary/15 transition-colors">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        {tag && (
          <span className={`text-[9px] font-bold tracking-widest uppercase ${tag === 'NEW' ? 'text-primary' : 'text-muted-foreground'}`}>
            {tag}
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-muted-foreground text-xs leading-relaxed mb-4">{desc}</p>
      {!disabled && (
        <div className="flex items-center gap-1 text-primary text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
          Open <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );

  if (disabled) return content;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className="h-full">{content}</a>;
  return <Link to={href} className="h-full">{content}</Link>;
}

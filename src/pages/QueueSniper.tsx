import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Terminal, Info, Code2, Play, Copy, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useCallback, useState, useEffect } from 'react';

/* ========== GLOW CARD (cursor glow + tilt + scale) ========== */
function GlowCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const rotateX = useSpring(0, { stiffness: 200, damping: 20 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(py * -12);
    rotateY.set(px * 12);
    setGlowPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); setHovering(false); }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative overflow-hidden ${className}`}
    >
      {hovering && (
        <div
          className="pointer-events-none absolute z-0 w-[300px] h-[300px] rounded-full"
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

/* ========== PARTICLE FIELD ========== */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const particles = useRef<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; pulse: number; pulseSpeed: number }[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();

    const count = Math.min(100, Math.floor(window.innerWidth / 16));
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.6 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    }));

    const onMove = (e: MouseEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        const dx = p.x - mouse.current.x;
        const dy = p.y - mouse.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.2;
          p.vy += (dy / dist) * force * 0.2;
        }
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.985; p.vy *= 0.985;
        p.pulse += p.pulseSpeed;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const pulseAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        const glowSize = dist < 150 ? p.size * (1 + (150 - dist) / 150) : p.size;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize * 4);
        gradient.addColorStop(0, `hsla(265, 80%, 65%, ${pulseAlpha * 0.3})`);
        gradient.addColorStop(1, `hsla(265, 80%, 65%, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(265, 80%, 75%, ${pulseAlpha})`;
        ctx.fill();
      });

      particles.current.forEach((a, i) => {
        particles.current.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(265, 80%, 65%, ${0.12 * (1 - dist / 160)})`;
            ctx.lineWidth = 0.8;
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

/* ========== COPY BUTTON ========== */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 bg-muted/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300 border border-border/50 hover:border-primary/30"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

/* ========== STAGGER ========== */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ========== MAIN ========== */
export default function QueueSniper() {
  const location = useLocation();

  const codeSnippet = `(() => {
  const target = "join queue";
  let scheduled = false;
  const find = () =>
    [...document.querySelectorAll("button,[role='button']")]
      .filter(el => el.textContent?.toLowerCase().includes(target));
  const run = () => {
    scheduled = false;
    const buttons = find();
    if (!buttons.length) return;
    buttons.forEach(btn => btn.click());
    console.log("clicked", buttons.length, "button(s)", new Date().toLocaleTimeString());
  };
  const schedule = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(run);
    }
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener("visibilitychange", schedule);
  window.addEventListener("focus", schedule);
  console.log("successfully injected keno's queue sniper >_<");
  run();
})();`;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleField />

      {/* ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-[-30%] left-[50%] -translate-x-1/2 w-[1200px] h-[600px] bg-primary/[0.06] blur-[200px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[20%] w-[600px] h-[600px] bg-primary/[0.04] blur-[180px] rounded-full" />
      </div>

      {/* Nav */}
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
            <Link to="/" className="text-xs tracking-wide text-muted-foreground hover:text-foreground px-4 py-2 transition-colors">Home</Link>
            <Link to="/queue-sniper" className="text-xs tracking-wide text-foreground px-4 py-2 transition-colors">Queue Sniper</Link>
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

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-36 md:pt-44 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3 mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-3 h-3" />
            <span>back to tools</span>
          </Link>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" />
            v1 live
          </span>
        </motion.div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground leading-[0.9] mb-2">
          <WavyText text="MCTiers" delay={0.4} />
        </h1>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-2">
          <WavyText text="Queue" className="text-primary" delay={0.7} />
        </h1>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-foreground leading-[0.9] mb-8">
          <WavyText text="Sniper" delay={1.0} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="text-sm md:text-base text-muted-foreground max-w-lg leading-relaxed"
        >
          snipe the MCTiers queue as FAST as you can. easy to setup with tutorial below.
        </motion.p>
      </section>

      {/* Cards */}
      <motion.section
        className="relative z-10 max-w-3xl mx-auto px-6 pb-32 space-y-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Introduction */}
        <motion.div variants={fadeUp}>
          <GlowCard className="bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-500">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent group-hover:via-primary/60 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 border border-border/50 rounded-xl flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5 transition-all duration-300">
                  <Info className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Introduction</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                the MCTiers queue sniper automatically clicks the "join queue" button the instant it appears on the page.
                it uses a MutationObserver to watch for DOM changes and fires on the next animation frame for maximum speed.
                just inject the script and let it do its thing.
              </p>
            </div>
          </GlowCard>
        </motion.div>

        {/* Setup Tutorial */}
        <motion.div variants={fadeUp}>
          <GlowCard className="bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-500">
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 border border-border/50 rounded-xl flex items-center justify-center">
                  <Play className="w-4 h-4 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Setup Tutorial</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                follow these steps to get the queue sniper running. takes less than a minute.
              </p>
              <ol className="space-y-4 text-sm text-muted-foreground">
                {[
                  'open the MCTiers Queue Channel in Discord',
                  <>open the browser console with <code className="px-1.5 py-0.5 bg-muted text-foreground text-xs border border-border/50">F12</code> or <code className="px-1.5 py-0.5 bg-muted text-foreground text-xs border border-border/50">Ctrl+Shift+J</code></>,
                  'copy the code from below and paste it into the console',
                  'press enter and wait, it\'ll auto-click "join queue" the moment it appears',
                ].map((step, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <span className="flex-shrink-0 w-7 h-7 border border-primary/30 bg-primary/5 text-primary text-xs font-bold flex items-center justify-center rounded-lg">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </GlowCard>
        </motion.div>

        {/* Code */}
        <motion.div variants={fadeUp}>
          <GlowCard className="bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/30 transition-all duration-500">
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 border border-border/50 rounded-xl flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Configuration</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                copy this code and paste it into your browser console on the MCTiers page.
              </p>
              <div className="relative bg-background/80 border border-border/50 p-5 font-mono text-sm text-muted-foreground overflow-x-auto hover:border-primary/20 transition-colors duration-300 rounded-xl">
                <CopyButton text={codeSnippet} />
                <pre className="whitespace-pre-wrap text-xs leading-relaxed">{codeSnippet}</pre>
              </div>
            </div>
          </GlowCard>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Terminal className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">keno's tools</span>
          </div>
          <span className="text-[11px] text-muted-foreground/50">keno's tools made by @wbu5</span>
        </div>
      </footer>
    </div>
  );
}

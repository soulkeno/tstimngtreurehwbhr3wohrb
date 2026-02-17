import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crosshair, Code2, Terminal, ArrowRight, Pencil, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
};

/* ---- Wavy text: each word fades up with a wave-like stagger ---- */
function WavyText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.3em]"
          initial={{ opacity: 0, y: 40, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: delay + i * 0.07,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ perspective: 600 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ---- Interactive dot grid background ---- */
function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  }, []);

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
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    const gap = 50;
    const baseRadius = 1;
    const influenceRadius = 150;

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
          const proximity = Math.max(0, 1 - dist / influenceRadius);

          const radius = baseRadius + proximity * 3;
          const alpha = 0.08 + proximity * 0.35;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(225, 75%, 60%, ${alpha})`;
          ctx.fill();
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}

export default function Landing() {
  const location = useLocation();
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <InteractiveGrid />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-[1]">
        <div className="absolute top-[-20%] right-[0%] w-[700px] h-[700px] bg-primary/[0.06] blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-primary/[0.04] blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground tracking-tight">keno's tools</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="hidden md:flex items-center gap-8"
        >
          <Link
            to="/"
            className={`text-xs tracking-wide uppercase transition-colors ${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Home
          </Link>
          <Link
            to="/queue-sniper"
            className={`text-xs tracking-wide uppercase transition-colors ${location.pathname === '/queue-sniper' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Queue Sniper
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <Button variant="ghost" size="sm" className="rounded-none text-xs" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" className="rounded-none border border-border bg-transparent text-foreground hover:bg-accent text-xs" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </motion.div>
      </nav>

      <AnimatePresence mode="wait">
        {!showTools ? (
          /* Hero */
          <motion.section
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35 }}
            className="relative z-10 max-w-5xl mx-auto px-6 pt-32 md:pt-44 pb-32"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-8 border border-primary/20"
            >
              <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
              UPDATE
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-4">
              <WavyText text="simple" delay={0.15} />
              <WavyText text="tools" className="text-primary" delay={0.5} />
            </h1>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-8">
              <WavyText text="by keno" delay={0.7} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="text-sm text-muted-foreground max-w-md leading-relaxed mb-12"
            >
              a collection of tools designed to be simple, fast and effective. built with care by @wbu5.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              <button
                onClick={() => setShowTools(true)}
                className="group relative inline-flex items-center gap-2.5 px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_hsl(225,75%,60%,0.4)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <Play className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">Start</span>
              </button>
            </motion.div>
          </motion.section>
        ) : (
          /* Tools */
          <motion.section
            key="tools"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-3"
            >
              <button
                onClick={() => setShowTools(false)}
                className="group text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide inline-flex items-center gap-1"
              >
                <ArrowRight className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
                back
              </button>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mb-2"
            >
              choose a tool
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-sm text-muted-foreground mb-10"
            >
              pick what you need from the collection.
            </motion.p>

            <motion.div
              className="grid md:grid-cols-3 gap-px bg-border"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {tools.map((tool) => (
                <motion.div key={tool.title} variants={itemVariants}>
                  <ToolCard {...tool} />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-6 text-center text-muted-foreground text-[11px] tracking-wide">
        © 2025 keno — all rights reserved.
      </footer>
    </div>
  );
}

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
    <div
      className={`group bg-card p-6 transition-all duration-200 h-full ${
        disabled ? 'opacity-35 cursor-not-allowed' : 'hover:bg-accent cursor-pointer'
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-9 h-9 bg-muted flex items-center justify-center group-hover:bg-primary/15 transition-colors">
          <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        {tag && (
          <span className={`text-[9px] font-bold tracking-widest uppercase ${
            tag === 'NEW' ? 'text-primary' : 'text-muted-foreground'
          }`}>
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

import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crosshair, Code2, Terminal, ArrowRight, Pencil, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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

export default function Landing() {
  const location = useLocation();
  const [showTools, setShowTools] = useState(false);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-30%] right-[-10%] w-[800px] h-[800px] bg-primary/[0.04] blur-[120px]" />
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[400px] bg-primary/[0.03] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground tracking-tight">keno's tools</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
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
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-none text-xs" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" className="rounded-none border border-border bg-transparent text-foreground hover:bg-accent text-xs" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        {!showTools ? (
          /* Hero */
          <motion.section
            key="hero"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 max-w-5xl mx-auto px-6 pt-32 md:pt-44 pb-32"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase mb-8 border border-primary/20"
            >
              UPDATE
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-8"
            >
              simple{' '}
              <span className="text-primary">tools</span>
              <br />
              by keno
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-sm text-muted-foreground max-w-md leading-relaxed mb-12"
            >
              a collection of tools designed to be simple, fast and effective. built with care by @wbu5.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <button
                onClick={() => setShowTools(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-card border border-border text-foreground text-sm font-medium hover:bg-accent transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Start
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
                className="text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wide"
              >
                ← back
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
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
        <div className="flex items-center gap-1 text-primary text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Open <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );

  if (disabled) return content;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className="h-full">{content}</a>;
  return <Link to={href} className="h-full">{content}</Link>;
}

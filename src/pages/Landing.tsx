import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crosshair, Code2, Terminal, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const tools = [
  {
    icon: Crosshair,
    title: 'MCTiers Queue Sniper',
    desc: 'snipe the MCTiers queue as FAST as you can, easy to setup with tutorial.',
    href: '/queue-sniper',
    tag: 'NEW',
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
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const } },
};

export default function Landing() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background wave-bg">
      <div className="hero-gradient absolute inset-0 h-[800px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground">keno's tools</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`nav-link-underline text-sm pb-1 transition-colors ${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Home
          </Link>
          <Link
            to="/queue-sniper"
            className={`nav-link-underline text-sm pb-1 transition-colors ${location.pathname === '/queue-sniper' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Queue Sniper
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="rounded-none btn-press" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" className="rounded-none btn-press border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20"
        >
          KENO'S TOOLS
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.05]"
        >
          tools created by <span className="text-primary">@wbu5</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed"
        >
          a collection of tools built by keno, designed to be simple fast and effective, easy to use btw :3
        </motion.p>
      </section>

      {/* Tool Cards */}
      <motion.section
        className="relative z-10 max-w-4xl mx-auto px-6 pb-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <motion.div key={tool.title} variants={itemVariants}>
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-muted-foreground text-sm">
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
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  href: string;
  tag?: string;
  disabled?: boolean;
}) {
  const content = (
    <div
      className={`group rounded-2xl border border-border bg-card p-8 transition-all duration-300 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 cursor-pointer'
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {tag && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            tag === 'NEW' ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'
          }`}>
            {tag}
          </span>
        )}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">{desc}</p>
      {!disabled && (
        <div className="flex items-center gap-1 text-primary text-sm font-medium">
          View Tool <ArrowRight className="w-4 h-4" />
        </div>
      )}
    </div>
  );

  if (disabled) return content;
  return <Link to={href}>{content}</Link>;
}

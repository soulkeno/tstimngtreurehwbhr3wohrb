import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crosshair, Code2, Terminal, ArrowRight, Pencil } from 'lucide-react';
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
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function Landing() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg text-foreground tracking-tight">keno's tools</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-sm transition-colors ${location.pathname === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Home
          </Link>
          <Link
            to="/queue-sniper"
            className={`text-sm transition-colors ${location.pathname === '/queue-sniper' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Queue Sniper
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-28 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-8 border border-primary/20"
        >
          <Terminal className="w-3 h-3" /> KENO'S TOOLS
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5 leading-[1.1]"
        >
          tools created by{' '}
          <span className="text-primary">@wbu5</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-base text-muted-foreground mb-14 max-w-md mx-auto leading-relaxed"
        >
          a collection of tools built by keno, designed to be simple fast and effective.
        </motion.p>
      </section>

      {/* Tool Cards */}
      <motion.section
        className="max-w-3xl mx-auto px-6 pb-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid md:grid-cols-2 gap-4">
          {tools.map((tool) => (
            <motion.div key={tool.title} variants={itemVariants}>
              <ToolCard {...tool} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-xs">
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
      className={`group rounded-xl border border-border bg-card p-6 transition-all duration-200 ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'hover:border-primary/30 hover:bg-card/80 cursor-pointer'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        {tag && (
          <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded ${
            tag === 'NEW' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
          }`}>
            {tag}
          </span>
        )}
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-3">{desc}</p>
      {!disabled && (
        <div className="flex items-center gap-1 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Open <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );

  if (disabled) return content;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
  return <Link to={href}>{content}</Link>;
}

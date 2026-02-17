import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Terminal, Info, Code2, Play, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useCallback, useState } from 'react';


const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const } },
};

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.02, 1.02, 1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className || ''}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

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
      className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

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
    <div className="min-h-screen bg-background relative">
      

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary-foreground" />
          </div>
          <Link to="/" className="font-bold text-lg text-foreground">keno's tools</Link>
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
      <section className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold mb-6 border border-green-500/20"
        >
          MCTIERS QUEUE SNIPER V1 IS NOW LIVE!
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-4"
        >
          MCTiers Queue Sniper
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg text-muted-foreground max-w-md mx-auto"
        >
          snipe the MCTiers queue as FAST as you can, easy to setup with tutorial.
        </motion.p>
      </section>

      {/* Cards */}
      <motion.section
        className="relative z-10 max-w-3xl mx-auto px-6 pb-32 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Introduction */}
        <motion.div variants={itemVariants}>
          <TiltCard>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                the MCTiers queue sniper automatically clicks the "join queue" button the instant it appears on the page. 
                it uses a MutationObserver to watch for DOM changes and fires on the next animation frame for maximum speed. 
                just inject the script and let it do its thing.
              </p>
            </div>
          </TiltCard>
        </motion.div>

        {/* Setup Tutorial */}
        <motion.div variants={itemVariants}>
          <TiltCard>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Play className="w-5 h-5 text-green-400" />
                <h2 className="text-2xl font-bold text-foreground">Setup Tutorial</h2>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                follow these steps to get the queue sniper running. takes less than a minute.
              </p>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  <span>open the MCTiers Queue Channel in Discord</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  <span>open the browser console with <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">F12</code> or <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">Ctrl+Shift+J</code></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">3</span>
                  <span>copy the code from below and paste it into the console</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">4</span>
                  <span>press enter and wait, it'll auto-click "join queue" the moment it appears</span>
                </li>
              </ol>
            </div>
          </TiltCard>
        </motion.div>

        {/* Code */}
        <motion.div variants={itemVariants}>
          <TiltCard>
            <div className="rounded-2xl border border-border bg-card p-8">
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Configuration</h2>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                copy this code and paste it into your browser console on the MCTiers page.
              </p>
              <div className="relative rounded-xl bg-background border border-border p-4 font-mono text-sm text-muted-foreground overflow-x-auto">
                <CopyButton text={codeSnippet} />
                <pre className="whitespace-pre-wrap">{codeSnippet}</pre>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-muted-foreground text-sm">
        © 2025 keno — all rights reserved.
      </footer>
    </div>
  );
}

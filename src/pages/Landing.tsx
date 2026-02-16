import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Zap, Shield, Search, Users, FileText, Lock,
  Play, Download, BarChart3, ChevronDown,
  ArrowRight, Headphones, Heart
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Docs', href: '#docs' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Download', href: '#download' },
  { label: 'Discord', href: '#discord' },
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Speed',
    desc: 'Keno prioritizes completing scans within a strict time frame, averaging around 60 seconds for comprehensive cheat detection.',
  },
  {
    icon: Search,
    title: 'Detection Quality',
    desc: 'Powered by cutting-edge AI and expert digital forensics, we provide precise, trustworthy cheat detection results.',
  },
  {
    icon: Shield,
    title: 'Military-Grade Security',
    desc: 'Keno is secured with military-grade encryption — because security comes first, and it\'s built into every part of our product.',
  },
];

const solutions = [
  { icon: Shield, title: 'Custom Detection Rules', desc: 'Keno offers customizations ranging from simple design tweaks to real-time threat detection — all as part of our service.' },
  { icon: Search, title: 'Forensic Detections', desc: 'Our detections are powered by deep expertise in digital forensics and an advanced understanding of operating systems.' },
  { icon: Headphones, title: '24/7 Active Support', desc: "Keno's support team sets us apart — delivering excellence and unmatched comfort to ensure the best service experience." },
  { icon: Users, title: 'Growing Community', desc: 'Our community is constantly growing, with 500+ active servers and dedicated members ready to help you!' },
  { icon: FileText, title: 'Complete Documentation', desc: 'We provide documentation tailored for both new users and experts in the field of screensharing and cheat detection.' },
  { icon: Lock, title: 'Privacy Focused', desc: 'With future-focused security, we ensure every trace of information remains completely protected and encrypted.' },
];

const steps = [
  { num: 1, title: 'Downloading', desc: 'Effortlessly scan suspects in seconds with two simple clicks that handle everything automatically.', icon: Download },
  { num: 2, title: 'Scanning', desc: 'Let Keno take care of all the hard work for you. Simply wait a few seconds while our advanced technology delivers accurate results.', icon: Search },
  { num: 3, title: 'Data Review', desc: 'Analyze the results on our dashboard and reach a final verdict on the suspect with confidence!', icon: BarChart3 },
];

const faqs = [
  { q: 'Why should you use Keno?', a: 'Keno offers you services to easily detect cheating users in your community through detections guaranteed by our team.' },
  { q: 'What operating systems do you support?', a: 'Our scanner supports Windows operating systems (7, 8, 10 and 11) and Linux distributions.' },
  { q: 'What type of data does Keno collect?', a: 'We securely store data such as login activity, activity timestamps, program usage, and more.' },
  { q: 'What payment methods do you accept?', a: 'We currently accept Credit/Debit Card, PayPal, US Bank Account, AliPay, WeChat Pay, PaySafeCard, Crypto, Pix, Cashapp, and Mercado Pago.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors"
      >
        {q}
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed"
        >
          {a}
        </motion.div>
      )}
    </div>
  );
}

// Wave text animation: each letter animates in with a staggered delay
function WaveText({ text, className }: { text: React.ReactNode; className?: string }) {
  if (typeof text !== 'string') {
    return (
      <motion.span
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={className}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.03,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0, 0, 0.2, 1] as const } },
};

function TeddyBear({ className }: { className?: string }) {
  return (
    <span className={`text-4xl select-none pointer-events-none ${className || ''}`} aria-hidden>
      🧸
    </span>
  );
}

function FloatingHearts() {
  const items = ['🧸', '💖', '🎀', '✨', '🌸', '💕', '🧸', '💗', '🎀', '✨', '🌸', '💖', '🧸', '💕', '✨', '🎀', '💖', '🧸'];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((emoji, i) => (
        <motion.span
          key={i}
          className="absolute select-none"
          style={{
            left: `${(i * 5.5) % 98}%`,
            top: `${(i * 11.3 + 5) % 95}%`,
            fontSize: `${14 + (i % 5) * 7}px`,
            opacity: 0.15 + (i % 3) * 0.05,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, (i % 2 === 0 ? 15 : -15), 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3 + (i % 4),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background wave-bg">
      <FloatingHearts />
      {/* Hero gradient */}
      <div className="hero-gradient absolute inset-0 h-[800px] pointer-events-none" />

      {/* Teddy bears decorations */}
      <div className="absolute top-20 left-4 text-5xl opacity-30 pointer-events-none select-none z-0 rotate-[-15deg]">🧸</div>
      <div className="absolute top-40 right-8 text-6xl opacity-20 pointer-events-none select-none z-0 rotate-12">🧸</div>
      <div className="absolute top-[600px] left-[5%] text-4xl opacity-25 pointer-events-none select-none z-0 rotate-[-8deg]">🎀</div>
      <div className="absolute top-[800px] right-[10%] text-5xl opacity-20 pointer-events-none select-none z-0 rotate-6">🧸</div>
      <div className="absolute top-[1200px] left-[8%] text-6xl opacity-15 pointer-events-none select-none z-0 rotate-[-20deg]">💖</div>
      <div className="absolute top-[1600px] right-[5%] text-5xl opacity-20 pointer-events-none select-none z-0 rotate-12">🧸</div>
      <div className="absolute top-[2000px] left-[3%] text-4xl opacity-25 pointer-events-none select-none z-0">🎀</div>
      <div className="absolute top-[2400px] right-[8%] text-6xl opacity-15 pointer-events-none select-none z-0 rotate-[-10deg]">🧸</div>

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-bold text-lg text-foreground">keno</span>
          <span className="text-xs ml-1">🎀</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link-underline text-sm text-muted-foreground hover:text-foreground transition-colors pb-1"
            >
              {l.label}
            </a>
          ))}
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
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20"
            >
              UPDATE 💖
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-[1.05]">
              <WaveText text="Most " />
              <WaveText text="powerful" className="text-primary" />
              <br />
              <WaveText text="Minecraft" />
              <br />
              <WaveText text="AntiCheat-Tool :3" />
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-lg text-muted-foreground mb-8 max-w-md leading-relaxed"
            >
              Experience an unparalleled service designed with quality, safety, and speed in mind. Detect cheaters in 60 seconds with advanced forensic analysis :3
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button size="lg" className="text-base px-8 py-6 gap-2 rounded-none btn-press">
                <Play className="w-4 h-4" fill="currentColor" />
                Start Keno
              </Button>
            </motion.div>
          </div>

          {/* Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
              <div className="p-4 bg-card border-b border-border flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">dashboard &gt; home</span>
              </div>
              <div className="p-6 grid grid-cols-[180px_1fr] gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded bg-primary/20" />
                    <span className="text-xs font-semibold text-foreground">Keno</span>
                  </div>
                  {['Home', 'Detected Cheaters', 'Scan History', 'Configs'].map((item, i) => (
                    <div key={item} className={`text-xs px-3 py-2 rounded-lg ${i === 0 ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}`}>
                      {item}
                    </div>
                  ))}
                  <div className="border-t border-border my-3" />
                  {['Server Logs', 'Player Reports'].map((item) => (
                    <div key={item} className="text-xs px-3 py-2 text-muted-foreground">{item}</div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Welcome Back,</p>
                    <p className="text-lg font-bold text-foreground">keno</p>
                  </div>
                  <div className="rounded-xl bg-muted/50 border border-border p-4 h-32 flex items-end">
                    <div className="flex items-end gap-2 w-full">
                      {[40, 65, 50, 80, 60, 75, 55, 70, 85, 60, 45, 70].map((h, i) => (
                        <div key={i} className="flex-1 rounded-sm bg-primary/30" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded-xl bg-muted/30 border border-border h-16" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <p className="text-sm font-semibold text-primary mb-2">See why</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Why Choose Keno Anti-Cheat :3
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Discover the key features of Keno 💖
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="group rounded-2xl border border-border bg-card p-8 hover-lift"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Solutions Grid */}
      <motion.section
        className="relative z-10 max-w-7xl mx-auto px-6 py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <p className="text-sm font-semibold text-primary mb-2">A reliable solution against cheaters</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Anti-Cheat Solutions :3
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            An introduction to the basic features and customizable options available with Keno.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {solutions.map((s) => (
            <motion.div key={s.title} variants={itemVariants} className="group rounded-2xl border border-border bg-card p-6 hover-lift">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="relative z-10 max-w-5xl mx-auto px-6 py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            How Keno works :3
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We show you how easy it is to use Keno: in just a few steps, you can download, scan, and get secure results.
          </p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              variants={itemVariants}
              className={`flex items-start gap-6 ${i % 2 === 1 ? 'flex-row-reverse text-right' : ''}`}
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                {s.num}
              </div>
              <div className="flex-1 rounded-2xl border border-border bg-card p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* FAQ */}
      <motion.section
        id="faq"
        className="relative z-10 max-w-3xl mx-auto px-6 py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <p className="text-sm font-semibold text-primary mb-2">You've got answers</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Answer your <span className="text-primary">questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((f) => (
            <motion.div key={f.q} variants={itemVariants}>
              <FAQItem q={f.q} a={f.a} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Footer */}
      <motion.section
        className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Start Playing Now 🧸
        </h2>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button size="lg" className="text-base px-8 py-6 rounded-none gap-2 btn-press" asChild>
            <Link to="/signup">
              Get Started <Heart className="w-4 h-4" fill="currentColor" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-base px-8 py-6 rounded-none btn-press">
            Join our Community 💖
          </Button>
        </div>
        <p className="text-muted-foreground text-sm mt-6">More than <strong className="text-foreground">500+</strong> frequent buyers 🎀</p>
      </motion.section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 text-center text-muted-foreground text-sm">
        © 2025 Keno — All rights reserved. 💖🧸
      </footer>
    </div>
  );
}

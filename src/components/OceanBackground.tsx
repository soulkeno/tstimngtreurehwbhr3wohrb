import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

function Fish({ delay, y, duration, size, flip }: { delay: number; y: string; duration: number; size: number; flip?: boolean }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: y }}
      initial={{ x: flip ? '-10vw' : '110vw', scaleX: flip ? 1 : -1 }}
      animate={{ x: flip ? '110vw' : '-10vw' }}
      transition={{ delay, duration, repeat: Infinity, ease: 'linear' }}
    >
      <svg width={size} height={size * 0.6} viewBox="0 0 60 36" fill="none">
        <ellipse cx="28" cy="18" rx="20" ry="12" fill="hsl(var(--primary) / 0.35)" />
        <polygon points="48,18 58,10 58,26" fill="hsl(var(--primary) / 0.3)" />
        <circle cx="20" cy="15" r="2" fill="hsl(var(--foreground) / 0.6)" />
      </svg>
    </motion.div>
  );
}

function Bubble({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      className="absolute rounded-full border border-primary/20 bg-primary/5 pointer-events-none"
      style={{ left: x, bottom: '-20px', width: size, height: size }}
      animate={{ y: [0, -800], opacity: [0.6, 0] }}
      transition={{ delay, duration: 8 + Math.random() * 6, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}

function Kelp({ x, height, delay }: { x: string; height: number; delay: number }) {
  return (
    <motion.div
      className="absolute bottom-0 pointer-events-none"
      style={{ left: x }}
      animate={{ rotateZ: [-2, 2, -2] }}
      transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="30" height={height} viewBox={`0 0 30 ${height}`} fill="none">
        <path
          d={`M15 ${height} C15 ${height * 0.7}, 5 ${height * 0.5}, 15 ${height * 0.3} C25 ${height * 0.15}, 10 ${height * 0.05}, 15 0`}
          stroke="hsl(150 60% 30% / 0.4)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}

export default function OceanBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Water gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-[hsl(200_40%_8%)]" />
      
      {/* Light rays from surface */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-[20%] w-[200px] h-[600px] bg-gradient-to-b from-primary/30 to-transparent rotate-[10deg] blur-3xl" />
        <div className="absolute top-0 left-[50%] w-[150px] h-[500px] bg-gradient-to-b from-primary/20 to-transparent rotate-[-5deg] blur-3xl" />
        <div className="absolute top-0 left-[75%] w-[180px] h-[550px] bg-gradient-to-b from-primary/25 to-transparent rotate-[8deg] blur-3xl" />
      </div>

      {/* Bubbles */}
      <Bubble delay={0} x="10%" size={8} />
      <Bubble delay={2} x="30%" size={5} />
      <Bubble delay={4} x="55%" size={10} />
      <Bubble delay={1} x="70%" size={6} />
      <Bubble delay={3} x="85%" size={7} />
      <Bubble delay={5} x="45%" size={4} />

      {/* Fish */}
      <Fish delay={0} y="20%" duration={18} size={50} />
      <Fish delay={5} y="45%" duration={22} size={35} flip />
      <Fish delay={10} y="65%" duration={20} size={45} />
      <Fish delay={3} y="80%" duration={25} size={30} flip />
      <Fish delay={8} y="35%" duration={16} size={40} />

      {/* Kelp at bottom */}
      <Kelp x="5%" height={180} delay={0} />
      <Kelp x="15%" height={140} delay={0.5} />
      <Kelp x="25%" height={160} delay={1} />
      <Kelp x="70%" height={150} delay={0.3} />
      <Kelp x="80%" height={170} delay={0.8} />
      <Kelp x="90%" height={130} delay={1.2} />

      {/* Coral shapes at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px]">
        <svg className="w-full h-full" viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none">
          <path d="M0 120 L0 80 Q100 40 200 70 Q300 90 400 60 Q500 30 600 55 Q700 80 800 50 Q900 20 1000 60 Q1100 90 1200 65 Q1300 40 1440 70 L1440 120 Z" fill="hsl(150 40% 15% / 0.3)" />
          <circle cx="150" cy="85" r="15" fill="hsl(350 60% 45% / 0.3)" />
          <circle cx="160" cy="75" r="10" fill="hsl(20 70% 50% / 0.25)" />
          <circle cx="140" cy="78" r="12" fill="hsl(340 50% 40% / 0.2)" />
          <circle cx="900" cy="70" r="18" fill="hsl(350 60% 45% / 0.25)" />
          <circle cx="920" cy="60" r="12" fill="hsl(30 70% 50% / 0.2)" />
          <circle cx="880" cy="65" r="14" fill="hsl(340 50% 40% / 0.2)" />
          <circle cx="500" cy="75" r="10" fill="hsl(350 55% 50% / 0.2)" />
          <circle cx="1200" cy="80" r="13" fill="hsl(20 65% 45% / 0.25)" />
        </svg>
      </div>
    </div>
  );
}

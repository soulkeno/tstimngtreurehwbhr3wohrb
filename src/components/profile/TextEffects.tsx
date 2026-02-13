import { useEffect, useState, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  loop?: boolean;
  loopDelay?: number;
}

export function TypewriterText({ text, className = '', speed = 80, loop = false, loopDelay = 2000 }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const runCycle = () => {
      i = 0;
      setDisplayed('');
      setDone(false);
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
          if (loop) {
            timeout = setTimeout(runCycle, loopDelay);
          }
        }
      }, speed);
      return interval;
    };

    const interval = runCycle();
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [text, speed, loop, loopDelay]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="animate-pulse">|</span>}
    </span>
  );
}

export function GlowText({ text, className = '' }: { text: string; className?: string }) {
  return <span className={`glow-text ${className}`}>{text}</span>;
}

export function RainbowText({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`rainbow-text ${className}`}>{text}</span>
  );
}

export function renderTextEffect(text: string, effect: string, className: string = '', options?: { loop?: boolean }) {
  switch (effect) {
    case 'typewriter':
      return <TypewriterText text={text} className={className} loop={options?.loop} />;
    case 'glow':
      return <GlowText text={text} className={className} />;
    case 'rainbow':
      return <RainbowText text={text} className={className} />;
    default:
      return <span className={className}>{text}</span>;
  }
}

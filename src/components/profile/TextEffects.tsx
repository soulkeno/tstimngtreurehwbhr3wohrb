import { useEffect, useState, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export function TypewriterText({ text, className = '', speed = 80 }: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

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

export function renderTextEffect(text: string, effect: string, className: string = '') {
  switch (effect) {
    case 'typewriter':
      return <TypewriterText text={text} className={className} />;
    case 'glow':
      return <GlowText text={text} className={className} />;
    case 'rainbow':
      return <RainbowText text={text} className={className} />;
    default:
      return <span className={className}>{text}</span>;
  }
}

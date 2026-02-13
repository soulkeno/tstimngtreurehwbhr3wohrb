import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface MusicPlayerProps {
  src: string;
}

export function MusicPlayer({ src }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);

    // Autoplay
    const tryPlay = () => {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };
    if (audio.readyState >= 2) tryPlay();
    else audio.addEventListener('canplaythrough', tryPlay, { once: true });

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(800px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale3d(1.04, 1.04, 1.04)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glass-card rounded-xl p-4 transition-transform duration-200 ease-out"
    >
      <audio ref={audioRef} src={src} preload="metadata" />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }} className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipBack className="w-4 h-4" />
          </button>
          <button onClick={toggle} className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors">
            {playing ? <Pause className="w-5 h-5 text-foreground" /> : <Play className="w-5 h-5 text-foreground ml-0.5" />}
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground w-10">{fmt(currentTime)}</span>
        <div className="flex-1 h-1 bg-secondary rounded-full cursor-pointer" onClick={seek}>
          <div
            className="h-full bg-foreground rounded-full transition-all"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <span className="text-xs text-muted-foreground w-10 text-right">{fmt(duration)}</span>
      </div>
    </div>
  );
}

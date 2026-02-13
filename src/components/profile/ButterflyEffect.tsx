import { useEffect, useRef } from 'react';

interface Butterfly {
  x: number;
  y: number;
  angle: number;
  speed: number;
  wingPhase: number;
  size: number;
}

export function ButterflyEffect({ targetRef }: { targetRef: React.RefObject<HTMLDivElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = targetRef.current;
    if (!canvas || !target) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const butterflies: Butterfly[] = [];

    const resize = () => {
      const rect = target.getBoundingClientRect();
      canvas.width = rect.width + 60;
      canvas.height = rect.height + 60;
      canvas.style.left = `${rect.left - 30}px`;
      canvas.style.top = `${rect.top - 30}px`;
    };
    resize();

    for (let i = 0; i < 5; i++) {
      butterflies.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        angle: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.3,
        wingPhase: Math.random() * Math.PI * 2,
        size: 4 + Math.random() * 3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      butterflies.forEach((b) => {
        b.wingPhase += 0.15;
        b.angle += (Math.random() - 0.5) * 0.1;
        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;

        // Wrap around
        if (b.x < -10) b.x = canvas.width + 10;
        if (b.x > canvas.width + 10) b.x = -10;
        if (b.y < -10) b.y = canvas.height + 10;
        if (b.y > canvas.height + 10) b.y = -10;

        const wing = Math.sin(b.wingPhase) * b.size;
        ctx.fillStyle = 'rgba(180,140,255,0.7)';
        ctx.beginPath();
        ctx.ellipse(b.x - wing * 0.7, b.y, Math.abs(wing), b.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(b.x + wing * 0.7, b.y, Math.abs(wing), b.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        // Body
        ctx.fillStyle = 'rgba(120,80,200,0.8)';
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, 1.5, b.size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [targetRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed pointer-events-none z-10"
      style={{ position: 'fixed' }}
    />
  );
}

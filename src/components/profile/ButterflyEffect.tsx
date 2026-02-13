import { useEffect, useRef } from 'react';

interface Butterfly {
  x: number;
  y: number;
  angle: number;
  speed: number;
  wingPhase: number;
  size: number;
  hue: number;
  targetX: number;
  targetY: number;
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

    const updateSize = () => {
      const rect = target.getBoundingClientRect();
      const padding = 60;
      canvas.width = rect.width + padding * 2;
      canvas.height = rect.height + padding * 2;
      canvas.style.width = `${canvas.width}px`;
      canvas.style.height = `${canvas.height}px`;
      canvas.style.left = `-${padding}px`;
      canvas.style.top = `-${padding}px`;
    };
    updateSize();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    for (let i = 0; i < 8; i++) {
      butterflies.push({
        x: cx + (Math.random() - 0.5) * canvas.width * 0.6,
        y: cy + (Math.random() - 0.5) * canvas.height * 0.6,
        angle: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.3,
        wingPhase: Math.random() * Math.PI * 2,
        size: 3 + Math.random() * 3,
        hue: Math.random() * 360,
        targetX: cx + (Math.random() - 0.5) * canvas.width * 0.4,
        targetY: cy + (Math.random() - 0.5) * canvas.height * 0.4,
      });
    }

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      butterflies.forEach((b) => {
        b.wingPhase += 0.12;

        // Reassign target occasionally for natural wandering
        if (frame % 120 === 0 || Math.random() < 0.005) {
          b.targetX = cx + (Math.random() - 0.5) * canvas.width * 0.5;
          b.targetY = cy + (Math.random() - 0.5) * canvas.height * 0.5;
        }

        // Steer toward target
        const dx = b.targetX - b.x;
        const dy = b.targetY - b.y;
        const targetAngle = Math.atan2(dy, dx);
        let angleDiff = targetAngle - b.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        b.angle += angleDiff * 0.03;
        b.angle += (Math.random() - 0.5) * 0.05;

        b.x += Math.cos(b.angle) * b.speed;
        b.y += Math.sin(b.angle) * b.speed;

        // Soft boundary
        if (b.x < 10) b.x = 10;
        if (b.x > canvas.width - 10) b.x = canvas.width - 10;
        if (b.y < 10) b.y = 10;
        if (b.y > canvas.height - 10) b.y = canvas.height - 10;

        const wing = Math.sin(b.wingPhase) * b.size;
        const alpha = 0.6 + Math.sin(b.wingPhase * 0.5) * 0.2;

        // Wings with gradient colors
        ctx.fillStyle = `hsla(${b.hue}, 70%, 70%, ${alpha})`;
        ctx.beginPath();
        ctx.ellipse(b.x - wing * 0.8, b.y, Math.abs(wing) * 1.2, b.size * 0.7, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(b.x + wing * 0.8, b.y, Math.abs(wing) * 1.2, b.size * 0.7, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Lower wings
        ctx.fillStyle = `hsla(${(b.hue + 30) % 360}, 60%, 60%, ${alpha * 0.7})`;
        ctx.beginPath();
        ctx.ellipse(b.x - wing * 0.5, b.y + b.size * 0.3, Math.abs(wing) * 0.8, b.size * 0.5, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(b.x + wing * 0.5, b.y + b.size * 0.3, Math.abs(wing) * 0.8, b.size * 0.5, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.fillStyle = `hsla(${b.hue}, 40%, 40%, 0.9)`;
        ctx.beginPath();
        ctx.ellipse(b.x, b.y, 1.5, b.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Sparkle trail
        if (frame % 3 === 0) {
          ctx.fillStyle = `hsla(${b.hue}, 80%, 80%, ${0.3 + Math.random() * 0.3})`;
          ctx.beginPath();
          ctx.arc(b.x - Math.cos(b.angle) * 5, b.y - Math.sin(b.angle) * 5, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animId);
  }, [targetRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute pointer-events-none z-10"
    />
  );
}

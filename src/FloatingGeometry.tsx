import { useEffect, useRef } from "react";

export default function FloatingGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Create particles
    const particles: {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;
      speed: number;
      angle: number;
      orbitRadius: number;
    }[] = [];

    const colors = [
      "rgba(217, 123, 102, 0.12)",
      "rgba(217, 123, 102, 0.08)",
      "rgba(96, 165, 250, 0.10)",
      "rgba(96, 165, 250, 0.06)",
      "rgba(244, 114, 182, 0.07)",
    ];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        baseX: Math.random() * window.innerWidth,
        baseY: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 30 + 10,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.04;
      mouseY += (targetY - mouseY) * 0.04;

      for (const p of particles) {
        // Natural orbit
        p.angle += p.speed * 0.01;
        const orbitX = Math.cos(p.angle) * p.orbitRadius;
        const orbitY = Math.sin(p.angle) * p.orbitRadius;

        // Mouse influence (gentle push)
        const dx = mouseX - p.baseX;
        const dy = mouseY - p.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 350;
        const influence = Math.max(0, 1 - dist / maxDist);
        const pushX = dx * influence * 0.06;
        const pushY = dy * influence * 0.06;

        p.x = p.baseX + orbitX + pushX;
        p.y = p.baseY + orbitY + pushY;

        // Draw soft circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Draw soft glow
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.size * 8
        );
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw faint connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(217, 123, 102, ${0.04 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
      style={{ opacity: 0.9 }}
    />
  );
}

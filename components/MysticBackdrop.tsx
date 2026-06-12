"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  speed: number;
  hue: number;
};

export function MysticBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let stars: Star[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = Math.max(70, Math.floor((width * height) / 11000));
      stars = Array.from({ length: starCount }, (_, index) => ({
        x: (index * 97) % width,
        y: (index * 53) % height,
        size: 0.7 + ((index * 17) % 18) / 10,
        speed: 0.08 + ((index * 13) % 15) / 100,
        hue: [42, 174, 262, 345][index % 4]
      }));
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const gradient = context.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#070812");
      gradient.addColorStop(0.5, "#111827");
      gradient.addColorStop(1, "#1b120b");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = "rgba(255, 255, 255, 0.045)";
      context.lineWidth = 1;
      for (let x = 0; x < width; x += 72) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y < height; y += 72) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const driftX = (pointerX - 0.5) * 18;
      const driftY = (pointerY - 0.5) * 18;

      stars.forEach((star, index) => {
        const pulse = reducedMotion.matches
          ? 0.65
          : 0.45 + Math.sin(time * 0.001 * star.speed + index) * 0.22;
        const x = (star.x + driftX * star.speed + time * 0.006 * star.speed) % width;
        const y = (star.y + driftY * star.speed + time * 0.004 * star.speed) % height;
        context.beginPath();
        context.fillStyle = `hsla(${star.hue}, 82%, 72%, ${0.35 + pulse * 0.4})`;
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fill();
      });

      context.strokeStyle = "rgba(217, 164, 65, 0.13)";
      context.lineWidth = 1;
      stars.slice(0, 22).forEach((star, index) => {
        const next = stars[(index * 7 + 11) % stars.length];
        const x1 = (star.x + driftX * star.speed) % width;
        const y1 = (star.y + driftY * star.speed) % height;
        const x2 = (next.x + driftX * next.speed) % width;
        const y2 = (next.y + driftY * next.speed) % height;
        const distance = Math.hypot(x1 - x2, y1 - y2);
        if (distance < 190) {
          context.beginPath();
          context.moveTo(x1, y1);
          context.lineTo(x2, y2);
          context.stroke();
        }
      });

      if (!reducedMotion.matches) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width;
      pointerY = (event.clientY - rect.top) / rect.height;
    };

    resize();
    draw(0);
    animationFrame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}

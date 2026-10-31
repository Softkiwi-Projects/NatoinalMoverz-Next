"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight, zero-dependency canvas confetti burst.
 * Respects prefers-reduced-motion media query.
 */
export default function ConfettiEffect() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect user motion preferences
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Brand theme colors: yellow (#ffd332), light yellow (#ffea79), navy (#0b1f4d), amber (#f59e0b), emerald (#10b981)
    const colors = ["#ffd332", "#ffea79", "#f59e0b", "#0b1f4d", "#10b981", "#ffffff"];

    const particleCount = 75;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 160,
        y: height * 0.28 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 11 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.28,
        drag: 0.982,
        opacity: 1,
        fadeSpeed: 0.007 + Math.random() * 0.005,
      });
    }

    const startTime = Date.now();
    const duration = 4000; // 4 seconds total burst

    const render = () => {
      const elapsed = Date.now() - startTime;
      ctx.clearRect(0, 0, width, height);

      let anyAlive = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.opacity <= 0.01) continue;
        anyAlive = true;

        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, p.opacity - p.fadeSpeed);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Draw small rectangles / ribbons
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      }

      if (anyAlive && elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      aria-hidden="true"
    />
  );
}

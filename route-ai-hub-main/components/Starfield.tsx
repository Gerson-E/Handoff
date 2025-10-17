"use client";
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number; // depth (0.2..1.2)
  r: number; // radius (1.5..3.5 regular, 4..5 bright)
  a: number; // alpha
  twinkle: number; // twinkle speed
  vx: number; // drift velocity x
  vy: number; // drift velocity y
  color: string; // base color
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const SPEED_MULTIPLIER = 0.6;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // regenerate stars on resize for consistent density
      const density = Math.min(400, Math.floor((w * h) / 7000));
      stars = new Array(density).fill(0).map(() => createStar(w, h));
      // add a few brighter stars (lower density)
      const brightCount = Math.max(4, Math.floor(density * 0.01));
      for (let i = 0; i < brightCount; i++) stars.push(createStar(w, h, true));
      draw(0, 0);
    }

    function createStar(w: number, h: number, bright = false): Star {
      const palette = ["#F5E6A8", "#FFE08A", "#FFF3C4", "#FFFFFF"]; // warm golds/white
      const color = palette[Math.floor(Math.random() * palette.length)];
      const depth = Math.random() * 1 + 0.2;
      const baseSpeed = (0.06 + Math.random() * 0.06) * SPEED_MULTIPLIER; // px/ms
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        z: depth,
        r: bright ? Math.random() * 1 + 4 : Math.random() * 2 + 1.5,
        a: bright ? Math.random() * 0.6 + 0.4 : Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 0.008 + 0.002, // 5–9s period approx
        vx: Math.cos(angle) * baseSpeed * (1 + depth * 0.5),
        vy: Math.sin(angle) * baseSpeed * (1 + depth * 0.5),
        color,
      };
    }

    function draw(dx: number, dy: number) {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#000814"; // deep black/navy base
      ctx.fillRect(0, 0, width, height);
      for (const s of stars) {
        const px = s.x + dx * s.z * 0.02;
        const py = s.y + dy * s.z * 0.02;
        const alpha = Math.max(0, Math.min(1, s.a));
        // radial gradient halo
        const grad = ctx.createRadialGradient(px, py, 0, px, py, s.r * 2.2);
        grad.addColorStop(0, withAlpha(s.color, alpha));
        grad.addColorStop(1, withAlpha(s.color, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, s.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let last = performance.now();
    function animate(now: number) {
      const dt = now - last; // ms
      last = now;
      if (!prefersReducedMotion) {
        // advance stars by velocity * dt, wrap around edges
        for (const s of stars) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          // twinkle modulation
          s.a += Math.sin(now * s.twinkle * 0.06) * 0.002;
          if (s.x < -10) s.x = canvas.width + 10;
          if (s.x > canvas.width + 10) s.x = -10;
          if (s.y < -10) s.y = canvas.height + 10;
          if (s.y > canvas.height + 10) s.y = -10;
        }
        draw(0, 0);
        raf = requestAnimationFrame(animate);
      }
    }

    function onReduceMotionChange(e: MediaQueryListEvent) {
      if (e.matches) {
        cancelAnimationFrame(raf);
        draw(0, 0);
      } else {
        animate();
      }
    }

    resize();
    if (!prefersReducedMotion) raf = requestAnimationFrame(animate);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener?.("change", onReduceMotionChange);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      mq.removeEventListener?.("change", onReduceMotionChange);
      window.removeEventListener("resize", resize);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-50" aria-hidden="true" />;
}

function withAlpha(hex: string, alpha: number) {
  // hex like #RRGGBB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}



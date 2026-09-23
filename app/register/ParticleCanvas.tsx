"use client";

import { useEffect, useRef } from "react";
import s from "./landing.module.css";

type Kind = "ember" | "star";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  base: number;
  tw: number;
  off: number;
  kind: Kind;
}

/** Pre-rendered soft radial dot — far cheaper than per-particle shadowBlur. */
function sprite(rgb: string) {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, `rgba(${rgb},0.95)`);
  grad.addColorStop(0.35, `rgba(${rgb},0.35)`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

/**
 * Ambient realm particles, ported from the Bhaaratbhushan/Waves_2026 portal:
 * embers rising on the infernal (left) side, stardust drifting on the
 * celestial (right) side. Sprite-batched, DPR-aware, pauses when the tab is
 * hidden. Render/unmount to toggle it.
 */
export default function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const emberSprite = sprite("255,120,60");
    const starSprite = sprite("255,232,170");

    let w = 0;
    let h = 0;
    let particles: P[] = [];

    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.round((w * h) / 24000));
      particles = Array.from({ length: count }, (): P => {
        const left = Math.random() < 0.5;
        return left
          ? {
              kind: "ember",
              x: Math.random() * w * 0.55,
              y: Math.random() * h,
              vx: (Math.random() - 0.5) * 0.25,
              vy: -(0.15 + Math.random() * 0.5),
              size: 2 + Math.random() * 5,
              base: 0.25 + Math.random() * 0.5,
              tw: 0.6 + Math.random() * 1.4,
              off: Math.random() * Math.PI * 2,
            }
          : {
              kind: "star",
              x: w * 0.45 + Math.random() * w * 0.55,
              y: Math.random() * h,
              vx: (Math.random() - 0.5) * 0.15,
              vy: 0.05 + Math.random() * 0.25,
              size: 1.5 + Math.random() * 3.5,
              base: 0.3 + Math.random() * 0.55,
              tw: 1 + Math.random() * 2,
              off: Math.random() * Math.PI * 2,
            };
      });
    };

    let raf = 0;
    let t = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (document.hidden) return;
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.kind === "ember") {
          if (p.y < -20) {
            p.y = h + 20;
            p.x = Math.random() * w * 0.55;
          }
          if (p.x < -20) p.x = w * 0.55;
          if (p.x > w * 0.6) p.x = 0;
        } else {
          if (p.y > h + 20) {
            p.y = -20;
            p.x = w * 0.45 + Math.random() * w * 0.55;
          }
          if (p.x < w * 0.4) p.x = w;
          if (p.x > w + 20) p.x = w * 0.4;
        }

        const a = Math.max(0, p.base + Math.sin(t * p.tw + p.off) * 0.3);
        const spr = p.kind === "ember" ? emberSprite : starSprite;
        const d = p.size * 6;
        ctx.globalAlpha = a;
        ctx.drawImage(spr, p.x - d / 2, p.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    build();
    if (reduce) {
      frame(); // draw one static frame, then stop
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener("resize", build);

    return () => {
      window.removeEventListener("resize", build);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={s.particles} />;
}

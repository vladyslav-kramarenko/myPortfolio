'use client';

import { useEffect, useRef } from 'react';
import type { WeatherCondition } from '../hooks/useWeather';
import styles from './WeatherBackground.module.css';

interface Props {
  condition: WeatherCondition | null;
}

// ── Cloud shape: circles relative to baseWidth ──────────────
const CLOUD_CIRCLES = [
  { dx:  0.00, dy:  0.00, r: 1.00 }, // dominant centre peak
  { dx: -0.42, dy:  0.20, r: 0.70 }, // left shoulder
  { dx:  0.44, dy:  0.18, r: 0.67 }, // right shoulder
  { dx: -0.78, dy:  0.34, r: 0.50 }, // far-left bump
  { dx:  0.80, dy:  0.32, r: 0.48 }, // far-right bump
  { dx:  0.05, dy:  0.44, r: 0.82 }, // wide base blob
];

interface Cloud { x: number; y: number; bw: number; speedX: number; opacity: number; }
interface Particle { x: number; y: number; speed: number; opacity: number; length?: number; radius?: number; drift?: number; }

function makeCloud(w: number, h: number, startX?: number): Cloud {
  return {
    x: startX ?? Math.random() * w * 1.6 - w * 0.3,
    y: h * 0.04 + Math.random() * h * 0.48,
    bw: 22 + Math.random() * 28,   // 22–50px — subtle atmospheric wisps
    speedX: -(0.06 + Math.random() * 0.14),
    opacity: 0.055 + Math.random() * 0.075,
  };
}

const CLOUD_COUNTS: Partial<Record<WeatherCondition | 'null', number>> = {
  sunny: 4, cloudy: 14, rainy: 10, foggy: 8, snowy: 9,
};

function initRain(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    speed: 9 + Math.random() * 7,
    length: 14 + Math.random() * 22,
    opacity: 0.055 + Math.random() * 0.07,
  }));
}

function initSnow(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    speed: 0.35 + Math.random() * 0.55,
    radius: 1.5 + Math.random() * 2.5,
    opacity: 0.35 + Math.random() * 0.45,
    drift: Math.random() * Math.PI * 2,
  }));
}

export default function WeatherBackground({ condition }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Theme reactivity ────────────────────────────────────
    let isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const mo = new MutationObserver(() => {
      isLight = document.documentElement.getAttribute('data-theme') === 'light';
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // ── Clouds ──────────────────────────────────────────────
    const cloudCount = CLOUD_COUNTS[condition ?? 'null'] ?? 3;
    const clouds: Cloud[] = Array.from({ length: cloudCount }, () =>
      makeCloud(canvas.width, canvas.height)
    );

    // ── Weather particles ───────────────────────────────────
    const ANGLE = 15 * (Math.PI / 180);
    const sinA = Math.sin(ANGLE);
    const cosA = Math.cos(ANGLE);

    const rain  = condition === 'rainy'  ? initRain(80,  canvas.width, canvas.height) : [];
    const snow  = condition === 'snowy'  ? initSnow(50, canvas.width, canvas.height) : [];
    let tick = 0;

    // ── Draw loop ───────────────────────────────────────────
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ── 1. Drifting clouds ────────────────────────────────
      const cloudColor = isLight ? '#607080' : '#ffffff';
      clouds.forEach(c => {
        ctx.save();
        ctx.globalAlpha = isLight ? c.opacity * 0.7 : c.opacity;
        ctx.fillStyle = cloudColor;
        ctx.beginPath();
        CLOUD_CIRCLES.forEach(({ dx, dy, r }) => {
          ctx.moveTo(c.x + dx * c.bw + r * c.bw, c.y + dy * c.bw);
          ctx.arc(c.x + dx * c.bw, c.y + dy * c.bw, r * c.bw, 0, Math.PI * 2);
        });
        ctx.fill();
        ctx.restore();

        c.x += c.speedX;
        if (c.x + c.bw * 2.2 < 0) {
          // Respawn off the right edge
          c.x = canvas.width + c.bw * 1.2;
          c.y = canvas.height * 0.04 + Math.random() * canvas.height * 0.48;
          c.bw = 22 + Math.random() * 28;
          c.opacity = 0.055 + Math.random() * 0.075;
          c.speedX = -(0.06 + Math.random() * 0.14);
        }
      });

      // ── 2. Rain ───────────────────────────────────────────
      if (condition === 'rainy') {
        ctx.lineWidth = 1;
        const rainColor = isLight ? '20, 100, 140' : '200, 230, 255';
        rain.forEach(p => {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${rainColor}, ${p.opacity})`;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + sinA * p.length!, p.y + cosA * p.length!);
          ctx.stroke();
          p.y += p.speed;
          p.x += p.speed * Math.tan(ANGLE);
          if (p.y > canvas.height + 60 || p.x > canvas.width + 60) {
            p.y = -60;
            p.x = Math.random() * (canvas.width + 100) - 50;
          }
        });
      }

      // ── 3. Snow ───────────────────────────────────────────
      if (condition === 'snowy') {
        tick++;
        const snowColor = isLight ? '10, 100, 180' : '220, 242, 255';
        snow.forEach(p => {
          ctx.beginPath();
          ctx.fillStyle = `rgba(${snowColor}, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.radius!, 0, Math.PI * 2);
          ctx.fill();
          p.y += p.speed;
          p.x += Math.sin(p.drift! + tick * 0.008) * 0.6;
          p.drift! += 0.005;
          if (p.y > canvas.height + 10) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }
        });
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      mo.disconnect();
    };
  }, [condition]);

  return (
    <>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      {condition === 'foggy' && (
        <div className={`${styles.overlay} ${styles.foggy}`} aria-hidden="true" />
      )}
      {condition === 'sunny' && (
        <div className={`${styles.overlay} ${styles.sunny}`} aria-hidden="true" />
      )}
    </>
  );
}

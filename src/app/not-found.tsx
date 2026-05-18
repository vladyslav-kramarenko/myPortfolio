'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './not-found.module.css';

const SERVICES = [
  'Lambda', 'S3', 'EC2', 'BigQuery', 'Looker',
  'Entra ID', 'CloudWatch', 'DynamoDB', 'IAM', 'VPC',
  'GAS', 'MDM', 'CRM API', 'Zapier', 'Python',
  'Node.js', 'Route 53', 'CI/CD', 'ABM', 'Terraform',
];

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  label: string;
}

const CONNECT_DIST  = 155;
const ATTRACT_DIST  = 210;
const ATTRACT_FORCE = 0.038;
const REPEL_DIST    = 65;

// Tier 1: enough connections to feel active
const T1_CONNS  = 12;
const T1_FRAMES = 60;

// Tier 2: every node reachable from every other (fully connected graph)
const T2_FRAMES = 90;

function parseColor(color: string): [number, number, number] {
  const rgb = color.match(/rgb[a]?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3]];
  const hex = color.replace('#', '').trim();
  if (hex.length === 6) return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
  return [0, 229, 255];
}
function rgba(color: string, alpha: number) {
  const [r, g, b] = parseColor(color);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** BFS — returns true when all nodes are in one connected component */
function isFullyConnected(nodes: Node[]): boolean {
  const visited = new Set<number>([0]);
  const queue   = [0];
  while (queue.length) {
    const cur = queue.shift()!;
    for (let i = 0; i < nodes.length; i++) {
      if (visited.has(i)) continue;
      const dx = nodes[cur].x - nodes[i].x;
      const dy = nodes[cur].y - nodes[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < CONNECT_DIST) {
        visited.add(i);
        queue.push(i);
      }
    }
  }
  return visited.size === nodes.length;
}

export default function NotFound() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const frameRef      = useRef<number>(0);
  const mouseRef      = useRef({ x: -500, y: -500 });

  const [tier1, setTier1] = useState(false);
  const [tier2, setTier2] = useState(false);
  const tier1Ref = useRef(false);
  const tier2Ref = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.clientWidth  || window.innerWidth;
      canvas.height = canvas.clientHeight || window.innerHeight - 64;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const getCSSVar = (v: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(v).trim();
    let accent    = getCSSVar('--accent-primary') || '#00e5ff';
    let textMuted = getCSSVar('--text-muted')     || 'rgba(180,180,180,0.6)';
    const mo = new MutationObserver(() => {
      accent    = getCSSVar('--accent-primary');
      textMuted = getCSSVar('--text-muted');
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Fewer nodes on mobile — large count on a small canvas auto-triggers tier 1
    const isMobile  = canvas.clientWidth < 768;
    const nodeCount = isMobile ? 10 : 20;
    const t1Conns   = isMobile ? 4  : 12;   // threshold scales with node count

    const nodes: Node[] = SERVICES.slice(0, nodeCount).map(label => ({
      x:  50 + Math.random() * (canvas.width  - 100),
      y:  50 + Math.random() * (canvas.height - 100),
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      label,
    }));

    let t1Frames = 0;
    let t2Frames = 0;
    // brief visual burst when tier 2 fires
    let burstFrames = 0;

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      if (t) mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove',  onTouch, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;

      // Cursor glow
      const grad = ctx.createRadialGradient(mx, my, 0, mx, my, ATTRACT_DIST);
      grad.addColorStop(0,   rgba(accent, 0.18));
      grad.addColorStop(0.5, rgba(accent, 0.05));
      grad.addColorStop(1,   rgba(accent, 0));
      ctx.beginPath();
      ctx.arc(mx, my, ATTRACT_DIST, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mx, my, 5, 0, Math.PI * 2);
      ctx.fillStyle   = rgba(accent, 0.8);
      ctx.shadowColor = accent;
      ctx.shadowBlur  = 16;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Physics
      nodes.forEach(n => {
        const dx   = mx - n.x;
        const dy   = my - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < REPEL_DIST) {
          n.vx -= (dx / dist) * 0.14;
          n.vy -= (dy / dist) * 0.14;
        } else if (dist < ATTRACT_DIST) {
          n.vx += (dx / dist) * ATTRACT_FORCE;
          n.vy += (dy / dist) * ATTRACT_FORCE;
        }
        n.vx *= 0.97; n.vy *= 0.97;
        n.x  += n.vx;  n.y  += n.vy;
        const p = 24;
        if (n.x < p)                 { n.x = p;                 n.vx =  Math.abs(n.vx); }
        if (n.x > canvas.width  - p) { n.x = canvas.width  - p; n.vx = -Math.abs(n.vx); }
        if (n.y < p)                 { n.y = p;                  n.vy =  Math.abs(n.vy); }
        if (n.y > canvas.height - p) { n.y = canvas.height - p;  n.vy = -Math.abs(n.vy); }
      });

      // Burst intensity for gold unlock moment
      const burstBoost = burstFrames > 0 ? (burstFrames / 40) : 0;
      if (burstFrames > 0) burstFrames--;

      // Connections
      let conns = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[j].x - nodes[i].x;
          const dy   = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            conns++;
            const baseAlpha = (1 - dist / CONNECT_DIST) * 0.55;
            const a = Math.min(1, baseAlpha + burstBoost * 0.4);
            ctx.beginPath();
            ctx.strokeStyle = rgba(accent, a);
            ctx.lineWidth   = 0.8 + burstBoost * 1.2;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Node dots
      nodes.forEach(n => {
        const r = 3.5 + burstBoost * 2.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle   = rgba(accent, 0.9);
        ctx.shadowColor = accent;
        ctx.shadowBlur  = 10 + burstBoost * 20;
        ctx.fill();
        ctx.shadowBlur  = 0;
        ctx.font        = '10px var(--font-roboto-mono, monospace)';
        ctx.fillStyle   = textMuted;
        ctx.fillText(n.label, n.x + 8, n.y + 4);
      });

      // ── Tier 1: enough connections ─────────────────────────
      if (!tier1Ref.current) {
        t1Frames = conns >= t1Conns ? t1Frames + 1 : Math.max(0, t1Frames - 1);
        if (t1Frames >= T1_FRAMES) {
          tier1Ref.current = true;
          setTier1(true);
        }
      }

      // ── Tier 2: fully connected graph ─────────────────────
      if (!tier2Ref.current) {
        const full = isFullyConnected(nodes);
        t2Frames = full ? t2Frames + 1 : Math.max(0, t2Frames - 1);
        if (t2Frames >= T2_FRAMES) {
          tier2Ref.current = true;
          burstFrames = 40;
          setTier2(true);
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove',  onTouch);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div className={styles.page}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      <div className={styles.overlay}>
        <p className={styles.code}>404</p>
        <p className={styles.title}>Route not found</p>
        <p className={tier1 ? styles.hintUnlocked : styles.hint}>
          {tier1
            ? '✦ You mapped the network. The engineer never gets lost.'
            : 'Move your cursor — the network is waiting to connect'}
        </p>
        <Link href="/" className={styles.homeLink}>← Back to home</Link>
      </div>

      {tier2 && (
        <div className={styles.achievement} role="status" aria-live="polite">
          <span className={styles.achieveIcon}>🔗</span>
          <div className={styles.achieveBody}>
            <span className={styles.achieveLabel}>All Nodes Online</span>
            <span className={styles.achieveName}>Full Mesh Established</span>
            <span className={styles.achieveQuote}>
              Most stop when it works. You stopped when it was right.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

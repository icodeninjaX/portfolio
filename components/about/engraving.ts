import { useEffect, useState } from "react";
import * as THREE from "three";

const W = 2048;
const H = 128;

/**
 * A strip of laser-etched bezel: tick marks along both edges and one line of
 * mono text. Drawn with the page's own self-hosted font once it is ready, so
 * there is no extra font fetch for WebGL.
 */
function draw(canvas: HTMLCanvasElement, text: string) {
  const family =
    getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "ui-monospace, monospace";
  const ctx = canvas.getContext("2d")!;
  // Fixed size: WebGL2 allocates immutable storage on first upload.
  canvas.width = W;
  canvas.height = H;
  const phrase = `${text}  ·  `;
  let size = 44;
  ctx.font = `500 ${size}px ${family}`;
  const natural = ctx.measureText(phrase).width;
  if (natural > W) {
    size = Math.floor((size * W) / natural);
    ctx.font = `500 ${size}px ${family}`;
  }
  // Spread the letters to fill the tile, the way bezel lettering is set.
  const spacing = Math.min(28, Math.max(0, (W - ctx.measureText(phrase).width) / phrase.length));
  const font = `500 ${size}px ${family}`;

  // brushed gunmetal
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, "#2b2520");
  grad.addColorStop(0.5, "#1c1814");
  grad.addColorStop(1, "#2b2520");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, H);
  for (let y = 0; y < H; y += 2) {
    ctx.fillStyle = `rgba(236, 229, 216, ${0.012 + ((y * 7919) % 13) / 700})`;
    ctx.fillRect(0, y, canvas.width, 1);
  }

  // bezel ticks: minor every 12px, major every 96px
  ctx.fillStyle = "rgba(236, 229, 216, 0.5)";
  for (let x = 0; x < canvas.width; x += 12) {
    const major = x % 96 === 0;
    const len = major ? 22 : 11;
    ctx.fillRect(x, 0, major ? 2 : 1, len);
    ctx.fillRect(x, H - len, major ? 2 : 1, len);
  }
  ctx.fillStyle = "rgba(236, 229, 216, 0.22)";
  ctx.fillRect(0, 26, canvas.width, 1);
  ctx.fillRect(0, H - 27, canvas.width, 1);

  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(242, 196, 154, 0.95)";
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${spacing}px`;
  ctx.fillText(phrase, 0, H / 2 + 2);
}

/**
 * Texture repeated around a ring so the lettering keeps its proportions.
 * Resolves once the page fonts are ready; `null` until then.
 */
export function useEngraving(text: string, radius: number, band: number) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let alive = true;
    const canvas = document.createElement("canvas");
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.anisotropy = 8;
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (!alive) return;
      draw(canvas, text);
      const tileLength = (W / H) * band;
      t.repeat.x = Math.max(1, Math.round((Math.PI * 2 * radius) / tileLength));
      t.needsUpdate = true;
      setTexture(t);
    });
    return () => {
      alive = false;
      t.dispose();
    };
  }, [text, radius, band]);

  return texture;
}

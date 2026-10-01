import { useEffect, useState } from "react";
import * as THREE from "three";

const W = 256;
const H = 1024;

export type PlaqueSpec = { index: string; year: string; elevation: number };

/**
 * The face of a survey monolith: brushed gunmetal, a graduated edge, the
 * waypoint number, the year set vertically and the elevation at the foot.
 * Same material language as the About page's ring bezels.
 */
function draw(canvas: HTMLCanvasElement, { index, year, elevation }: PlaqueSpec) {
  const family =
    getComputedStyle(document.body).getPropertyValue("--font-geist-mono").trim() || "ui-monospace, monospace";
  const ctx = canvas.getContext("2d")!;
  canvas.width = W;
  canvas.height = H;

  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, "#1c1814");
  grad.addColorStop(0.5, "#2b2520");
  grad.addColorStop(1, "#1c1814");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  for (let y = 0; y < H; y += 2) {
    ctx.fillStyle = `rgba(236, 229, 216, ${0.01 + ((y * 7919) % 13) / 900})`;
    ctx.fillRect(0, y, W, 1);
  }

  // graduated left edge, like a surveyor's staff
  ctx.fillStyle = "rgba(236, 229, 216, 0.45)";
  for (let y = 40; y < H - 40; y += 16) {
    const major = (y - 40) % 128 === 0;
    ctx.fillRect(18, y, major ? 30 : 14, major ? 2 : 1);
  }
  ctx.fillStyle = "rgba(236, 229, 216, 0.2)";
  ctx.fillRect(18, 40, 1, H - 80);

  ctx.textBaseline = "alphabetic";
  const setSpacing = (px: number) => {
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
  };

  ctx.fillStyle = "rgba(236, 229, 216, 0.55)";
  ctx.font = `500 26px ${family}`;
  setSpacing(6);
  ctx.fillText("WP", 70, 92);
  ctx.fillStyle = "rgba(255, 170, 100, 1)";
  ctx.font = `500 92px ${family}`;
  setSpacing(0);
  ctx.fillText(index, 64, 186);

  // year, set vertically up the face
  ctx.save();
  ctx.translate(170, H - 150);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "rgba(242, 196, 154, 0.95)";
  let size = 78;
  ctx.font = `500 ${size}px ${family}`;
  setSpacing(8);
  const max = H - 420;
  const natural = ctx.measureText(year.toUpperCase()).width;
  if (natural > max) {
    size = Math.floor((size * max) / natural);
    ctx.font = `500 ${size}px ${family}`;
  }
  ctx.fillText(year.toUpperCase(), 0, 0);
  ctx.restore();

  ctx.fillStyle = "rgba(236, 229, 216, 0.22)";
  ctx.fillRect(64, H - 118, W - 100, 1);
  ctx.fillStyle = "rgba(236, 229, 216, 0.6)";
  ctx.font = `500 22px ${family}`;
  setSpacing(4);
  ctx.fillText(`ELEV ${String(elevation).padStart(4, "0")}M`, 64, H - 76);
}

/** Resolves once the page fonts are ready; `null` until then. */
export function usePlaque(spec: PlaqueSpec) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const { index, year, elevation } = spec;

  useEffect(() => {
    let alive = true;
    const canvas = document.createElement("canvas");
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (!alive) return;
      draw(canvas, { index, year, elevation });
      t.needsUpdate = true;
      setTexture(t);
    });
    return () => {
      alive = false;
      t.dispose();
    };
  }, [index, year, elevation]);

  return texture;
}

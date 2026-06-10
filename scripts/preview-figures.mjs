// Dev-only helper: rasterizes the stretch figures into a PNG contact sheet
// so they can be eyeballed without a browser. Not part of the app build.
import { deflateSync } from 'node:zlib';
import { writeFileSync, readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/figures.jsx', import.meta.url), 'utf8');

// Extract per-figure shapes from the JSX source.
const figures = [];
const figRe = /(\w+): \(\s*<>([\s\S]*?)<\/>/g;
let m;
while ((m = figRe.exec(src))) {
  const [, name, body] = m;
  const shapes = [];
  for (const tag of body.matchAll(/<(path|circle|ellipse|rect)([^/]*)\/>/g)) {
    const attrs = {};
    for (const a of tag[2].matchAll(/(\w+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    shapes.push({ type: tag[1], ...attrs });
  }
  figures.push({ name, shapes });
}

const CELL = 220;
const COLS = 5;
const ROWS = Math.ceil(figures.length / COLS);
const W = CELL * COLS;
const H = CELL * ROWS;

const COLORS = {
  limb: [31, 41, 55],
  muscle: [22, 163, 74],
  head: [31, 41, 55],
  prop: [180, 185, 192]
};

const distSeg = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1, dy = y2 - y1;
  const L = dx * dx + dy * dy;
  const t = L ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L)) : 0;
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
};

function shapeDist(s, x, y) {
  if (s.type === 'circle') {
    return Math.hypot(x - +s.cx, y - +s.cy) - +s.r;
  }
  if (s.type === 'ellipse') {
    // Check if point is INSIDE the (possibly rotated) ellipse.
    // Apply inverse rotation from the transform="rotate(angle cx cy)" if present.
    let lx = x - +s.cx, ly = y - +s.cy;
    if (s.transform) {
      const m = s.transform.match(/rotate\(([-\d.]+)[, ]+([-\d.]+)[, ]+([-\d.]+)\)/);
      if (m) {
        const [, ang, px, py] = m.map(Number);
        const rad = (-ang * Math.PI) / 180;
        const ox = x - px, oy = y - py;
        lx = ox * Math.cos(rad) - oy * Math.sin(rad);
        ly = ox * Math.sin(rad) + oy * Math.cos(rad);
      }
    }
    const nx = lx / +s.rx, ny = ly / +s.ry;
    // Return negative if inside (filled shape), positive if outside
    return Math.hypot(nx, ny) - 1;
  }
  if (s.type === 'rect') {
    const segs = [];
    const x1 = +s.x, y1 = +s.y, x2 = x1 + +s.width, y2 = y1 + +s.height;
    segs.push([x1, y1, x2, y1], [x2, y1, x2, y2], [x2, y2, x1, y2], [x1, y2, x1, y1]);
    return Math.min(...segs.map(([a, b, c, d]) => distSeg(x, y, a, b, c, d)));
  }
  // path: sequence of M/L commands
  const nums = s.d.match(/-?[\d.]+/g).map(Number);
  let best = Infinity;
  for (let i = 2; i < nums.length; i += 2) {
    best = Math.min(best, distSeg(x, y, nums[i - 2], nums[i - 1], nums[i], nums[i + 1]));
  }
  return best;
}

const px = Buffer.alloc(W * H * 4, 255);
for (let gy = 0; gy < ROWS; gy++) {
  for (let gx = 0; gx < COLS; gx++) {
    const fig = figures[gy * COLS + gx];
    if (!fig) continue;
    for (let y = 0; y < CELL; y++) {
      for (let x = 0; x < CELL; x++) {
        const u = ((x - 10) / (CELL - 20)) * 200;
        const v = ((y - 10) / (CELL - 20)) * 200;
        let col = null;
        for (const s of fig.shapes) {
          const d = shapeDist(s, u, v);
          const r = s.type === 'circle' ? 0 : s.className === 'prop' ? 2.5 : 3.5;
          // Ellipses are filled shapes — inside = d < 0; everything else is stroke
          const hit = s.type === 'ellipse' ? d < 0 : d <= r;
          if (hit) col = COLORS[s.className] ?? COLORS.limb;
        }
        if (col) {
          const o = ((gy * CELL + y) * W + gx * CELL + x) * 4;
          px[o] = col[0];
          px[o + 1] = col[1];
          px[o + 2] = col[2];
        }
      }
    }
  }
}

// minimal PNG writer
const T = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc = (b) => {
  let c = -1;
  for (const v of b) c = T[(c ^ v) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};
const chunk = (t, d) => {
  const l = Buffer.alloc(4);
  l.writeUInt32BE(d.length);
  const body = Buffer.concat([Buffer.from(t), d]);
  const c = Buffer.alloc(4);
  c.writeUInt32BE(crc(body));
  return Buffer.concat([l, body, c]);
};
const raw = Buffer.alloc(H * (W * 4 + 1));
for (let y = 0; y < H; y++) px.copy(raw, y * (W * 4 + 1) + 1, y * W * 4, (y + 1) * W * 4);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;
ihdr[9] = 6;
writeFileSync(
  '/tmp/figures-preview.png',
  Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ])
);
console.log('order:', figures.map((f) => f.name).join(', '));
console.log('wrote /tmp/figures-preview.png');

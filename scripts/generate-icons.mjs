// Generates PWA icon PNGs (a stick figure in a stretch pose on a green disc)
// without any image library: rasterizes simple shapes and writes PNG via zlib.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(outDir, { recursive: true });

const CRC_TABLE = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function writePng(path, size, pixelFn) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelFn(x / size, y / size);
      raw.writeUInt32BE(((r << 24) | (g << 16) | (b << 8) | a) >>> 0, row + 1 + x * 4);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  writeFileSync(
    path,
    Buffer.concat([
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      chunk('IHDR', ihdr),
      chunk('IDAT', deflateSync(raw, { level: 9 })),
      chunk('IEND', Buffer.alloc(0))
    ])
  );
  console.log('wrote', path);
}

// Geometry helpers in unit space (0..1)
const distSeg = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1, dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
};
const smooth = (d, r, aa = 0.008) => Math.max(0, Math.min(1, (r - d) / aa + 0.5));

// Stick figure in a lunge stretch pose, drawn in unit coordinates.
const STROKES = [
  [0.42, 0.38, 0.55, 0.52], // torso (leaning forward)
  [0.55, 0.52, 0.45, 0.68], // front thigh
  [0.45, 0.68, 0.46, 0.84], // front shin
  [0.55, 0.52, 0.72, 0.66], // back thigh
  [0.72, 0.66, 0.84, 0.82], // back shin
  [0.42, 0.38, 0.30, 0.50], // arm down
  [0.42, 0.38, 0.56, 0.30] // arm forward
];
const HEAD = [0.39, 0.27, 0.065];

function iconPixel(u, v, { padded }) {
  const bg = [22, 163, 74]; // green-600
  const cx = u - 0.5, cy = v - 0.5;
  const discR = padded ? 0.42 : 0.5;
  const disc = smooth(Math.hypot(cx, cy), discR);
  if (disc <= 0) return [0, 0, 0, 0];
  // map figure into the disc area
  const s = padded ? 0.72 : 0.86;
  const fu = (u - 0.5) / s + 0.5;
  const fv = (v - 0.52) / s + 0.55;
  let fig = smooth(Math.hypot(fu - HEAD[0], fv - HEAD[1]), HEAD[2]);
  for (const [x1, y1, x2, y2] of STROKES) {
    fig = Math.max(fig, smooth(distSeg(fu, fv, x1, y1, x2, y2), 0.035));
  }
  const r = Math.round(bg[0] + (255 - bg[0]) * fig);
  const g = Math.round(bg[1] + (255 - bg[1]) * fig);
  const b = Math.round(bg[2] + (255 - bg[2]) * fig);
  return [r, g, b, Math.round(disc * 255)];
}

writePng(join(outDir, 'pwa-192.png'), 192, (u, v) => iconPixel(u, v, { padded: false }));
writePng(join(outDir, 'pwa-512.png'), 512, (u, v) => iconPixel(u, v, { padded: true }));
// iOS ignores transparency on touch icons, so fill the corners with the bg color.
writePng(join(outDir, 'apple-touch-icon.png'), 180, (u, v) => {
  const p = iconPixel(u, v, { padded: false });
  const a = p[3] / 255;
  return [
    Math.round(p[0] * a + 22 * (1 - a)),
    Math.round(p[1] * a + 163 * (1 - a)),
    Math.round(p[2] * a + 74 * (1 - a)),
    255
  ];
});

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const coversDir = join(__dirname, '..', 'public', 'covers');
mkdirSync(coversDir, { recursive: true });

const placeholders = {
  'jujutsu-kaisen.jpg': { w: 600, h: 800, c1: '#1a0a2e', c2: '#e94560', label: 'JJK' },
  'lookism.jpg': { w: 400, h: 300, c1: '#16213e', c2: '#0f3460', label: 'Lookism' },
  'kan-kg-loh.jpg': { w: 200, h: 200, c1: '#2d1b4e', c2: '#7b2cbf', label: 'KKL' },
  'weikzar.jpg': { w: 200, h: 200, c1: '#1b263b', c2: '#415a77', label: 'Weikzar' },
};

for (const [filename, { w, h, c1, c2, label }] of Object.entries(placeholders)) {
  const dest = join(coversDir, filename);
  if (existsSync(dest)) continue;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      font-family="Inter,sans-serif" font-size="${Math.min(w,h)/6}" font-weight="bold" fill="white" opacity="0.8">${label}</text>
  </svg>`;
  writeFileSync(dest.replace('.jpg', '.svg'), svg);
  console.log(`Created ${filename.replace('.jpg', '.svg')}`);
}

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const coversDir = join(__dirname, '..', 'public', 'covers');
mkdirSync(coversDir, { recursive: true });

const fallbacks = {
  'jujutsu-kaisen.jpg': 'https://picsum.photos/seed/jujutsu/400/600',
  'lookism.jpg': 'https://picsum.photos/seed/lookism/400/300',
  'kan-kg-loh.jpg': 'https://picsum.photos/seed/kankgloh/200/200',
  'weikzar.jpg': 'https://picsum.photos/seed/weikzar/200/200',
};

for (const [filename, url] of Object.entries(fallbacks)) {
  const dest = join(coversDir, filename);
  if (existsSync(dest)) {
    console.log(`Skipped ${filename}`);
    continue;
  }
  try {
    const res = await fetch(url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
    console.log(`Downloaded fallback ${filename}`);
  } catch (err) {
    console.warn(`Failed ${filename}: ${err.message}`);
  }
}

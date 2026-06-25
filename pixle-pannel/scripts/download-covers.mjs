import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const coversDir = join(__dirname, '..', 'public', 'covers');
const publicDir = join(__dirname, '..', 'public');
mkdirSync(coversDir, { recursive: true });

const covers = {
  'jujutsu-kaisen.jpg': [
    'https://upload.wikimedia.org/wikipedia/en/7/77/Jujutsu_Kaisen_volume_1_cover.jpg',
    'https://cdn.myanimelist.net/images/manga/2/210961.jpg',
  ],
  'tbate.jpg': ['https://cdn.myanimelist.net/images/manga/2/216129.jpg'],
  'one-piece.jpg': ['https://cdn.myanimelist.net/images/manga/2/253146.jpg'],
  'dandadan.jpg': ['https://cdn.myanimelist.net/images/manga/3/287015.jpg'],
  'lookism.jpg': [
    'https://upload.wikimedia.org/wikipedia/en/8/8a/Lookism_Volume_1_Cover.jpg',
    'https://cdn.myanimelist.net/images/manga/1/209592.jpg',
  ],
  'kan-kg-loh.jpg': [
    'https://cdn.myanimelist.net/images/manga/2/216046.jpg',
    'https://cdn.myanimelist.net/images/manga/1/267489.jpg',
  ],
  'weikzar.jpg': [
    'https://cdn.myanimelist.net/images/manga/1/244752.jpg',
    'https://cdn.myanimelist.net/images/manga/3/216873.jpg',
  ],
  'noragami.jpg': ['https://cdn.myanimelist.net/images/manga/2/171872.jpg'],
};

async function downloadFile(filename, urls) {
  const dest = join(coversDir, filename);
  if (existsSync(dest)) {
    console.log(`Skipped ${filename} (exists)`);
    return;
  }
  for (const url of urls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 1000) throw new Error('File too small');
      writeFileSync(dest, buf);
      console.log(`Downloaded ${filename}`);
      return;
    } catch (err) {
      console.warn(`  ${url}: ${err.message}`);
    }
  }
  console.warn(`Failed all URLs for ${filename}`);
}

for (const [filename, urls] of Object.entries(covers)) {
  await downloadFile(filename, urls);
}

const avatarPath = join(publicDir, 'avatar.jpg');
if (!existsSync(avatarPath)) {
  const avatarUrls = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    'https://i.pravatar.cc/150?img=47',
  ];
  for (const url of avatarUrls) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      writeFileSync(avatarPath, Buffer.from(await res.arrayBuffer()));
      console.log('Downloaded avatar.jpg');
      break;
    } catch (err) {
      console.warn(`  avatar ${url}: ${err.message}`);
    }
  }
}

console.log('Covers download complete.');

import sharp from 'sharp';
import { statSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

sharp.cache(false);
const ASSETS = path.resolve('src/assets');
const kb = (p) => (statSync(p).size / 1024).toFixed(0);

// [file, maxWidth, outFile(optional → convert)]
const jobs = [
  // Big JPGs (4080px) → re-encode in place at 1600px q80
  ['kids-post.jpg', 1600, null],
  ['kids-games.jpg', 1600, null],
  ['kids-games-3.jpg', 1600, null],
  ['self-improvement.jpg', 1200, null],
  // PNG photos → convert to JPG (huge win), new file
  ['kids-games-2.png', 1600, 'kids-games-2.jpg'],
  ['kids-grading.png', 1000, 'kids-grading.jpg'],
  ['bjj-kids-banner.png', 1400, 'bjj-kids-banner.jpg'],
];

for (const [file, maxW, outName] of jobs) {
  const src = path.join(ASSETS, file);
  const before = kb(src);
  const out = path.join(ASSETS, outName ?? file);
  const input = readFileSync(src); // decouple from file handle
  const buf = await sharp(input)
    .rotate() // respect EXIF orientation
    .resize({ width: maxW, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  writeFileSync(out, buf);
  console.log(`${file.padEnd(24)} ${before.padStart(5)}KB → ${kb(out).padStart(5)}KB  ${outName ? '(→ ' + outName + ')' : ''}`);
}
console.log('done');

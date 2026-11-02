const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const { createHash } = require('crypto');

async function generateIcons() {
  const root = path.join(__dirname, '..');
  const source = await fs.readFile(path.join(root, 'public/brand/icon.svg'));
  const revision = createHash('sha256').update(source).digest('hex').slice(0, 12);
  const iconsDir = path.join(root, 'public/icons');
  await fs.mkdir(iconsDir, { recursive: true });
  for (const size of [72, 96, 128, 144, 152, 180, 192, 384, 512]) {
    await sharp(source).resize(size, size).png().toFile(path.join(iconsDir, `icon-${size}x${size}.png`));
    await fs.writeFile(path.join(iconsDir, `icon-${size}x${size}.svg`), source);
  }
  // The source keeps the graduation symbol within the central maskable safe area.
  await sharp(source).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));
  await fs.writeFile(path.join(root, 'public/icon.svg'), source);
  const png = await sharp(source).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = 32;
  header[7] = 32;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  const ico = Buffer.concat([header, png]);
  await fs.writeFile(path.join(root, 'app/favicon.ico'), ico);
  await fs.writeFile(path.join(root, 'public/favicon.ico'), ico);
  const manifestPath = path.join(root, 'public/manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  manifest.icons = manifest.icons.map((icon) => ({ ...icon, src: `${icon.src.split('?')[0]}?v=${revision}` }));
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log('Generated PWA, Apple touch, and favicon icons from public/brand/icon.svg');
}

generateIcons().catch((error) => { console.error(error); process.exitCode = 1; });

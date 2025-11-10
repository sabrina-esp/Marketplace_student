const fs = require('fs');
const path = require('path');

// Create icons directory
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('🎨 Generating PWA Icons as SVG...\n');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background Circle -->
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="url(#grad-${size})"/>
  
  <!-- Letter M -->
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial, Helvetica, sans-serif" 
    font-size="${size * 0.5}" 
    font-weight="bold" 
    fill="white" 
    text-anchor="middle" 
    dominant-baseline="central">M</text>
  
  <!-- Graduation cap -->
  <g transform="translate(${size * 0.68}, ${size * 0.28})">
    <path fill="white" opacity="0.9" d="M0,-${size*0.05} L-${size*0.08},-${size*0.02} L0,${size*0.01} L${size*0.08},-${size*0.02} Z"/>
    <rect x="-${size*0.01}" y="${size*0.01}" width="${size*0.02}" height="${size*0.06}" fill="white" opacity="0.9"/>
  </g>
</svg>`;

  // Save as SVG
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(iconsDir, filename), svg);
  console.log(`✅ Created ${filename}`);
});

// Create a special PNG fallback using data URI
console.log('\n📝 Creating PNG conversion instructions...\n');

const instructions = `# PWA Icons Generated!

## ✅ SVG Icons Created

All icon sizes have been generated as SVG files:
${sizes.map(s => `- icon-${s}x${s}.svg`).join('\n')}

## 🔄 Convert to PNG (Choose ONE method)

### Method 1: Use Online Converter (EASIEST)
1. Go to: https://cloudconvert.com/svg-to-png
2. Upload all SVG files from this folder
3. Download the PNG files
4. Replace the SVG files with PNG files

### Method 2: Use the Browser (RECOMMENDED)
1. Open: http://localhost:3011/icons/icon-generator.html
2. Click "Download All Icons"
3. Save all PNG files to this folder

### Method 3: Use Inkscape (if installed)
\`\`\`bash
inkscape icon-72x72.svg --export-filename=icon-72x72.png
inkscape icon-96x96.svg --export-filename=icon-96x96.png
inkscape icon-128x128.svg --export-filename=icon-128x128.png
inkscape icon-144x144.svg --export-filename=icon-144x144.png
inkscape icon-152x152.svg --export-filename=icon-152x152.png
inkscape icon-192x192.svg --export-filename=icon-192x192.png
inkscape icon-384x384.svg --export-filename=icon-384x384.png
inkscape icon-512x512.svg --export-filename=icon-512x512.png
\`\`\`

## ⚡ Quick Test

For now, PWA will work with SVG icons in modern browsers.
But for best compatibility, convert to PNG!

## 🧪 Test Installation

1. Go to http://localhost:3011
2. Wait 5-10 seconds
3. Click the install prompt
4. App installs to your desktop!
`;

fs.writeFileSync(path.join(iconsDir, 'CONVERSION_INSTRUCTIONS.txt'), instructions);

console.log('✨ Done! SVG icons created.');
console.log('\n📋 Next steps:');
console.log('1. Open http://localhost:3011/icons/icon-generator.html');
console.log('2. Download PNG versions');
console.log('3. Or test with SVG icons (works in Chrome/Edge)');
console.log('');

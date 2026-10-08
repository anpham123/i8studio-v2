const fs = require('fs');
const path = require('path');

const loaderPath = path.join(__dirname, '../node_modules/next/dist/compiled/@next/font/dist/google/loader.js');

try {
  if (fs.existsSync(loaderPath)) {
    let content = fs.readFileSync(loaderPath, 'utf8');
    const target = 'const ext = /\\.(woff|woff2|eot|ttf|otf)$/.exec(googleFontFileUrl)[1];';
    const replacement = "const cleanUrl = String(googleFontFileUrl).replace(/['\\\"]/g, '').split('?')[0]; const ext = (/\\.(woff|woff2|eot|ttf|otf)/i.exec(cleanUrl) || ['', 'woff2'])[1];";
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      fs.writeFileSync(loaderPath, content, 'utf8');
      console.log('✅ Patched @next/font loader.js');
    }
  }
} catch (err) {
  console.warn('⚠️ Could not patch next/font:', err.message);
}

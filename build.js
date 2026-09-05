const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('🚀 Building AWS SBG VPKBIET production bundle...');

const root = __dirname;
const targetDirs = ['dist', 'build'];

targetDirs.forEach(target => {
  const targetPath = path.join(root, target);
  if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });

  // Copy primary HTML files
  fs.copyFileSync(path.join(root, 'index.html'), path.join(targetPath, 'index.html'));
  fs.copyFileSync(path.join(root, 'admin.html'), path.join(targetPath, 'admin.html'));

  // Copy folders
  copyRecursiveSync(path.join(root, 'src'), path.join(targetPath, 'src'));
  copyRecursiveSync(path.join(root, 'public'), path.join(targetPath, 'public'));
  copyRecursiveSync(path.join(root, 'data'), path.join(targetPath, 'data'));

  console.log(`✅ Successfully compiled build target: /${target}`);
});

// Also ensure public/ folder has fallback index.html and assets in case Vercel defaults output to public/
fs.copyFileSync(path.join(root, 'index.html'), path.join(root, 'public', 'index.html'));
fs.copyFileSync(path.join(root, 'admin.html'), path.join(root, 'public', 'admin.html'));
copyRecursiveSync(path.join(root, 'src'), path.join(root, 'public', 'src'));
copyRecursiveSync(path.join(root, 'data'), path.join(root, 'public', 'data'));
console.log('✅ Synchronized public/ fallbacks');

console.log('🎉 Production build complete! Ready for Vercel, Netlify, or local deployment.');

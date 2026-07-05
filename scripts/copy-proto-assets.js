const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const sourceDir = path.join(repoRoot, 'libs', 'proto-schema', 'src', 'proto');
const targetDir = path.join(repoRoot, 'dist', 'libs', 'proto-schema', 'proto');

if (!fs.existsSync(sourceDir)) {
  console.error(`Source directory not found: ${sourceDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

for (const entry of fs.readdirSync(sourceDir)) {
  const srcPath = path.join(sourceDir, entry);
  const destPath = path.join(targetDir, entry);
  if (fs.statSync(srcPath).isFile() && entry.endsWith('.proto')) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${entry} -> ${destPath}`);
  }
}

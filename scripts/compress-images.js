/* eslint-disable */
// 压缩图片：
//  - 封面(src/assets/parks/*/cover.*)：原地转成 cover.jpg，最大宽 600，q72，留在主包
//  - 详情图(src/assets/parks/*/[0-9].*)：输出到 cloud-upload/parks/<id>/N.jpg，最大宽 900，q70，待上传云存储
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const ASSETS = path.join(ROOT, 'src', 'assets', 'parks');
const CLOUD_OUT = path.join(ROOT, 'cloud-upload', 'parks');

const DIR_RE = /^[a-z0-9-]+$/;
const PHOTO_RE = /^(\d+)\.(jpe?g|png)$/i;

function fmtKB(b) { return (b / 1024).toFixed(1) + 'KB'; }

function writeAtomic(out, buf) {
  const tmp = out + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, buf);
  fs.renameSync(tmp, out);
}

async function processCover(dir, entry) {
  const src = path.join(dir, entry);
  const out = path.join(dir, 'cover.jpg');
  const buf = await sharp(src)
    .rotate()
    .resize({ width: 600, withoutEnlargement: true })
    .jpeg({ quality: 72, mozjpeg: true })
    .toBuffer();
  writeAtomic(out, buf);
  // 若源不是 cover.jpg，删掉旧文件（png/jpeg 封面）
  if (path.basename(entry).toLowerCase() !== 'cover.jpg') {
    try { fs.unlinkSync(src); } catch (e) {}
  }
  return { name: path.basename(dir) + '/cover.jpg', size: buf.length };
}

async function processPhoto(dir, entry, parkId) {
  const m = entry.match(PHOTO_RE);
  const num = m[1];
  const src = path.join(dir, entry);
  const outDir = path.join(CLOUD_OUT, parkId);
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, num + '.jpg');
  const buf = await sharp(src)
    .rotate()
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 70, mozjpeg: true })
    .toBuffer();
  writeAtomic(out, buf);
  return { name: parkId + '/' + num + '.jpg', size: buf.length };
}

(async () => {
  fs.mkdirSync(CLOUD_OUT, { recursive: true });
  const coverResults = [];
  const photoResults = [];
  const skipped = [];
  const dirs = fs.readdirSync(ASSETS, { withFileTypes: true })
    .filter((d) => d.isDirectory() && DIR_RE.test(d.name))
    .map((d) => d.name);

  for (const parkId of dirs) {
    const dir = path.join(ASSETS, parkId);
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const lower = f.toLowerCase();
      if (lower.startsWith('cover.')) {
        coverResults.push(await processCover(dir, f));
      } else if (PHOTO_RE.test(f)) {
        try {
          photoResults.push(await processPhoto(dir, f, parkId));
        } catch (e) {
          skipped.push(parkId + '/' + f);
          console.log('SKIP bad photo:', parkId + '/' + f, '-', e.message.split('\n')[0]);
        }
      }
    }
  }

  const coverTotal = coverResults.reduce((s, r) => s + r.size, 0);
  const photoTotal = photoResults.reduce((s, r) => s + r.size, 0);
  console.log('=== 封面（主包） ===');
  console.log('count=%d total=%s', coverResults.length, fmtKB(coverTotal));
  const bigCovers = coverResults.filter((r) => r.size > 200 * 1024);
  if (bigCovers.length) console.log('  仍>200KB:', bigCovers.map((r) => r.name + ' ' + fmtKB(r.size)));
  console.log('=== 详情图（云存储） ===');
  console.log('count=%d total=%s', photoResults.length, fmtKB(photoTotal));
  const bigPhotos = photoResults.filter((r) => r.size > 200 * 1024);
  if (bigPhotos.length) console.log('  仍>200KB:', bigPhotos.map((r) => r.name + ' ' + fmtKB(r.size)));
  if (skipped.length) console.log('=== 跳过的坏文件（需从数据剔除） ===\n' + skipped.join('\n'));
})();

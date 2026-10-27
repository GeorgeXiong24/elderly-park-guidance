/* eslint-disable */
// 扫描 cloud-upload/parks/<id>/[n].jpg，生成 src/data/parkPhotos.ts（cloud:// 引用）
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLOUD_DIR = path.join(ROOT, 'cloud-upload', 'parks');
const OUT = path.join(ROOT, 'src', 'data', 'parkPhotos.ts');

const parkIds = fs.readdirSync(CLOUD_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const lines = [];
lines.push('// 自动生成：图片托管在微信云存储，见 scripts/gen-park-photos.js');
lines.push('// 运行 scripts/upload-cloud.js 后，云存储路径为 parks/<id>/<n>.jpg');
lines.push("import { cloudFile } from '@/config/cloud';");
lines.push('');
lines.push('export const PARK_PHOTOS: Record<string, string[]> = {');

for (const id of parkIds) {
  const dir = path.join(CLOUD_DIR, id);
  const nums = fs.readdirSync(dir)
    .filter((f) => /^\d+\.jpg$/.test(f))
    .map((f) => parseInt(f, 10))
    .sort((a, b) => a - b);
  const arr = nums.map((n) => `cloudFile('parks/${id}/${n}.jpg')`).join(', ');
  lines.push(`  '${id}': [${arr}],`);
}
lines.push('};');
lines.push('');

fs.writeFileSync(OUT, lines.join('\n'));
console.log('wrote', OUT, 'parks=', parkIds.length);

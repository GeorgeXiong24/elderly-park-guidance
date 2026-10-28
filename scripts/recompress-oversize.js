/* eslint-disable */
// 把某个目录里超过 200 K 的图片重新压到限额以内（默认 dist，即构建产物）。
// 微信「代码质量」的规则是「图片和音频资源大小不应超过 200 K」，
// 保险起见统一压到 180 K 以下，宽度不低于 800px。
//
// 注意：详情图由 scripts/build-local-photos.js 统一压到 55KB 以内，
// 正常不需要用这个脚本；它只是构建产物超限时的兜底工具。
//
// 用法：
//   node scripts/recompress-oversize.js                # 处理 dist
//   node scripts/recompress-oversize.js <目录> [上限KB]
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const TARGET_DIR = path.resolve(ROOT, process.argv[2] || 'dist');
const LIMIT_KB = Number(process.argv[3] || 200);
const GOAL_KB = Math.floor(LIMIT_KB * 0.9); // 留 10% 余量

if (!fs.existsSync(TARGET_DIR)) {
  console.error('✗ 目录不存在：' + TARGET_DIR);
  process.exit(1);
}

const IMG_RE = /\.(jpe?g|png)$/i;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (IMG_RE.test(e.name)) out.push(p);
  }
  return out;
}

async function shrink(file) {
  const before = fs.statSync(file).size;
  if (before <= LIMIT_KB * 1024) return { file, before, after: before, skipped: true };

  const stages = [];
  for (const width of [900, 820, 750, 680, 600]) {
    for (const quality of [70, 62, 55, 48]) {
      stages.push({ width, quality });
    }
  }

  let best = null;
  for (const { width, quality } of stages) {
    const buf = await sharp(file)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (buf.length <= GOAL_KB * 1024) {
      best = { buf, width, quality };
      break;
    }
    if (!best || buf.length < best.buf.length) best = { buf, width, quality };
  }

  const tmp = file + '.tmp-' + process.pid;
  fs.writeFileSync(tmp, best.buf);
  fs.renameSync(tmp, file);
  return { file, before, after: best.buf.length, width: best.width, quality: best.quality };
}

(async () => {
  const files = walk(TARGET_DIR);
  const big = files.filter((f) => fs.statSync(f).size > LIMIT_KB * 1024);
  console.log(`扫描 ${files.length} 张，其中 >${LIMIT_KB}KB 的 ${big.length} 张`);
  let worst = 0;
  for (const f of big) {
    const r = await shrink(f);
    worst = Math.max(worst, r.after);
    console.log(
      `  ${path.relative(ROOT, r.file).replace(/\\/g, '/')}  ${(r.before / 1024).toFixed(1)}KB → ${(r.after / 1024).toFixed(1)}KB` +
        (r.width ? `  (${r.width}px q${r.quality})` : '')
    );
  }
  if (!big.length) {
    console.log('✓ 没有超过 ' + LIMIT_KB + 'KB 的图片');
    return;
  }
  console.log(`\n✓ 处理完成，最大 ${(worst / 1024).toFixed(1)}KB`);
  const still = walk(TARGET_DIR).filter((f) => fs.statSync(f).size > LIMIT_KB * 1024);
  if (still.length) {
    console.log('✗ 仍有超限文件：');
    still.forEach((f) => console.log('   ' + f));
    process.exit(1);
  }
})();

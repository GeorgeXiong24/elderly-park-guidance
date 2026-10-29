/* eslint-disable */
// 把详情图全部打进代码包（不使用任何云存储）。
//
// 做三件事：
//   1. 从原图目录重新压出 750px、≤55KB 的详情图（原图默认在项目内的本地素材库）
//   2. 按体积把 26 个公园分进若干个分包（每个分包 ≤1.7MB，微信单包上限 2MB）
//   3. 生成分包页面 src/pages/dN/{index.tsx,photos.ts,index.config.ts}、
//      src/data/parkGroup.ts，并改写 src/app.config.ts 里的 subPackages
//
// 图片只在仓库里存一份：压缩结果拷进 src/pages/dN/img 后，临时中转目录立即删除，
// 不在仓库里留下第二份完全相同的图片。
//
// 用法：
//   node scripts/build-local-photos.js
//   npm run build:weapp
const fs = require('fs');
const os = require('os');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const ORIGINALS = process.env.PARK_ORIGINALS
  ? path.resolve(process.env.PARK_ORIGINALS)
  : path.resolve(ROOT, 'local-assets', 'originals', 'parks');
// 压缩结果只作为中转，拷进 src/pages/dN/img 后立即删除，
// 避免在仓库里再多留一份和代码包完全相同的图片。
const STAGE = fs.mkdtempSync(path.join(os.tmpdir(), 'park-photos-'));
const PAGES = path.join(ROOT, 'src', 'pages');
const APP_CONFIG = path.join(ROOT, 'src', 'app.config.ts');
const PARK_GROUP = path.join(ROOT, 'src', 'data', 'parkGroup.ts');

const PHOTO_RE = /^(\d+)\.(jpe?g|png)$/i;
const LIMIT_BYTES = 55 * 1024; // 单张上限（微信规则 200K，留足余量）
const GROUP_BYTES = 1.7 * 1024 * 1024; // 每个分包的图片预算（分包上限 2MB）
const WIDTHS = [750, 700, 650, 600];

const fmtKB = (b) => (b / 1024).toFixed(1) + 'KB';
const fmtMB = (b) => (b / 1024 / 1024).toFixed(2) + 'MB';
const varName = (id, n) => `p_${id.replace(/-/g, '_')}_${n}`;

// 宽度 × 质量阶梯里找第一个不超过上限的结果
async function encode(src) {
  let best = null;
  for (const width of WIDTHS) {
    for (const quality of [62, 56, 50, 46, 42]) {
      const buf = await sharp(src)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality, mozjpeg: true })
        .toBuffer();
      if (buf.length <= LIMIT_BYTES) return { buf, width, quality };
      if (!best || buf.length < best.buf.length) best = { buf, width, quality };
    }
  }
  return best;
}

async function stageAll() {
  if (!fs.existsSync(ORIGINALS)) {
    throw new Error('找不到原图目录：' + ORIGINALS + '\n可用 $env:PARK_ORIGINALS 指定');
  }
  fs.rmSync(STAGE, { recursive: true, force: true });

  const parks = [];
  const skipped = [];
  for (const d of fs.readdirSync(ORIGINALS, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const id = d.name;
    const dir = path.join(ORIGINALS, id);
    const nums = fs
      .readdirSync(dir)
      .filter((f) => PHOTO_RE.test(f))
      .map((f) => ({ file: f, n: parseInt(f.match(PHOTO_RE)[1], 10) }))
      .sort((a, b) => a.n - b.n);

    const files = [];
    let bytes = 0;
    for (const { file, n } of nums) {
      try {
        const { buf } = await encode(path.join(dir, file));
        const out = path.join(STAGE, id, n + '.jpg');
        fs.mkdirSync(path.dirname(out), { recursive: true });
        fs.writeFileSync(out, buf);
        files.push({ n, size: buf.length });
        bytes += buf.length;
      } catch (e) {
        skipped.push(id + '/' + file);
        console.log('SKIP 坏文件:', id + '/' + file, '-', e.message.split('\n')[0]);
      }
    }
    parks.push({ id, files, bytes });
  }
  return { parks, skipped };
}

// 大块优先的贪心装箱
function groupParks(parks) {
  const sorted = [...parks].sort((a, b) => b.bytes - a.bytes);
  const groups = [];
  for (const park of sorted) {
    if (park.bytes > GROUP_BYTES) {
      // 单个公园就超过预算：独占一个分包（真实体积仍 <2MB）
      groups.push({ parks: [park], bytes: park.bytes });
      continue;
    }
    let target = groups.find((g) => g.bytes + park.bytes <= GROUP_BYTES);
    if (!target) {
      target = { parks: [], bytes: 0 };
      groups.push(target);
    }
    target.parks.push(park);
    target.bytes += park.bytes;
  }
  // 组内按公园 id 排序，输出稳定
  groups.forEach((g) => g.parks.sort((a, b) => a.id.localeCompare(b.id)));
  return groups;
}

function cleanOldGroups() {
  for (const d of fs.readdirSync(PAGES, { withFileTypes: true })) {
    if (d.isDirectory() && /^d\d+$/.test(d.name)) {
      fs.rmSync(path.join(PAGES, d.name), { recursive: true, force: true });
    }
  }
}

function writeGroup(groups) {
  const map = {};
  groups.forEach((group, index) => {
    const name = 'd' + (index + 1);
    const dir = path.join(PAGES, name);
    fs.mkdirSync(path.join(dir, 'img'), { recursive: true });

    const imports = [];
    const entries = [];
    for (const park of group.parks) {
      const arr = [];
      for (const f of park.files) {
        const rel = `./img/${park.id}/${f.n}.jpg`;
        const from = path.join(STAGE, park.id, f.n + '.jpg');
        const to = path.join(dir, 'img', park.id, f.n + '.jpg');
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
        imports.push(`import ${varName(park.id, f.n)} from '${rel}';`);
        arr.push(varName(park.id, f.n));
      }
      entries.push(`  '${park.id}': [${arr.join(', ')}],`);
      map[park.id] = `/pages/${name}/index`;
    }

    fs.writeFileSync(
      path.join(dir, 'photos.ts'),
      `// 由 scripts/build-local-photos.js 生成，请勿手改\n${imports.join('\n')}\n\n` +
        `export const PHOTOS: Record<string, string[]> = {\n${entries.join('\n')}\n};\n`
    );

    fs.writeFileSync(
      path.join(dir, 'index.tsx'),
      `import React from 'react';\nimport ParkDetailView from '@/components/ParkDetailView';\nimport { PHOTOS } from './photos';\n\n` +
        `const Page: React.FC = () => <ParkDetailView photos={PHOTOS} />;\n\nexport default Page;\n`
    );

    fs.writeFileSync(
      path.join(dir, 'index.config.ts'),
      `export default definePageConfig({ navigationBarTitleText: '公园详情' });\n`
    );
  });

  const lines = Object.keys(map)
    .sort()
    .map((id) => `  '${id}': '${map[id]}',`);
  fs.writeFileSync(
    PARK_GROUP,
    `// 由 scripts/build-local-photos.js 生成，请勿手改\n` +
      `// 公园 id → 承载它详情图的分包页面\n` +
      `export const PARK_PAGE: Record<string, string> = {\n${lines.join('\n')}\n};\n`
  );

  return groups.length;
}

function writeAppConfig(count) {
  const src = fs.readFileSync(APP_CONFIG, 'utf8');
  const start = '// <photo-subpackages>';
  const end = '// </photo-subpackages>';
  const i = src.indexOf(start);
  const j = src.indexOf(end);
  if (i < 0 || j < 0) throw new Error('app.config.ts 里缺少 ' + start + ' / ' + end + ' 标记');

  const items = [];
  for (let k = 1; k <= count; k++) {
    items.push(`    {\n      root: 'pages/d${k}',\n      pages: ['index']\n    }`);
  }
  const block = `${start}\n${items.join(',\n')}\n    ${end}`;
  fs.writeFileSync(APP_CONFIG, src.slice(0, i) + block + src.slice(j + end.length));
}

(async () => {
  try {
    console.log('原图目录:', ORIGINALS);
    const { parks, skipped } = await stageAll();
    const total = parks.reduce((s, p) => s + p.bytes, 0);
    console.log(
      '压缩完成：%d 个公园，%d 张，合计 %s，最大单张 %s',
      parks.length,
      parks.reduce((s, p) => s + p.files.length, 0),
      fmtMB(total),
      fmtKB(Math.max(...parks.flatMap((p) => p.files.map((f) => f.size))))
    );

    const groups = groupParks(parks);
    cleanOldGroups();
    const count = writeGroup(groups);
    writeAppConfig(count);

    console.log('\n分包划分（图片体积）：');
    groups.forEach((g, i) => {
      console.log(
        `  pages/d${i + 1}  ${fmtMB(g.bytes).padStart(8)}  ${g.parks.length} 个公园：` +
          g.parks.map((p) => p.id).join(', ')
      );
    });
    console.log('\n主包图片：26 张封面 739KB；总分包图片 ' + fmtMB(total) + '；共计 ' + count + ' 个分包');
    if (skipped.length) console.log('\n跳过的坏文件：\n' + skipped.join('\n'));
    console.log('\n下一步：npm run build:weapp');
  } finally {
    // 中转目录用完即删，仓库里只保留 src/pages/dN/img 这一份图片
    fs.rmSync(STAGE, { recursive: true, force: true });
  }
})();

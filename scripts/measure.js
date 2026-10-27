const fs = require('fs');
const path = require('path');
const dist = path.resolve(__dirname, '..', 'dist');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push({ p, size: fs.statSync(p).size });
  }
  return out;
}
const all = walk(dist);
const rel = (p) => path.relative(dist, p);
const main = all.filter((f) => !rel(f.p).startsWith(path.join('pages', 'park-detail')));
const sub = all.filter((f) => rel(f.p).startsWith(path.join('pages', 'park-detail')));
const sum = (a) => a.reduce((s, f) => s + f.size, 0);
const kb = (b) => (b / 1024).toFixed(1) + 'KB';
console.log('MAIN:', kb(sum(main)), 'files=' + main.length);
console.log('SUB :', kb(sum(sub)), 'files=' + sub.length);
console.log('--- top 12 main ---');
main.sort((a, b) => b.size - a.size).slice(0, 12).forEach((f) => console.log(kb(f.size), rel(f.p)));
console.log('--- packaged images/audio >200KB ---');
const big = all.filter((f) => /\.(jpe?g|png|gif|webp|mp3|aac|m4a)$/i.test(f.p) && f.size > 200 * 1024);
if (!big.length) console.log('none');
big.forEach((f) => console.log(kb(f.size), rel(f.p)));
console.log('--- app.json lazyCodeLoading ---');
const appJson = JSON.parse(fs.readFileSync(path.join(dist, 'app.json'), 'utf8'));
console.log('lazyCodeLoading =', appJson.lazyCodeLoading);

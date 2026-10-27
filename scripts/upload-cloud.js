/* eslint-disable */
// 把 cloud-upload/parks/**.jpg 批量上传到微信云开发云存储。
//
// 用法（先设环境变量）：
//   Windows PowerShell:
//     $env:TB_ENV_ID="你的云环境ID"
//     $env:TENCENT_SECRET_ID="你的SecretId"
//     $env:TENCENT_SECRET_KEY="你的SecretKey"
//     node scripts/upload-cloud.js
//
// SecretId/SecretKey 在 腾讯云控制台 -> 访问管理 -> API密钥管理 新建。
// 云环境ID 在 微信开发者工具 -> 云开发 控制台顶部。
const fs = require('fs');
const path = require('path');
const { CloudBaseManager } = require('@cloudbase/manager-node');

const ROOT = path.resolve(__dirname, '..');
const LOCAL_DIR = path.join(ROOT, 'cloud-upload', 'parks');

const envId = process.env.TB_ENV_ID || process.env.CLOUD_ENV;
const secretId = process.env.TENCENT_SECRET_ID;
const secretKey = process.env.TENCENT_SECRET_KEY;

if (!envId || !secretId || !secretKey) {
  console.error('请先设置环境变量：TB_ENV_ID / TENCENT_SECRET_ID / TENCENT_SECRET_KEY');
  process.exit(1);
}

function walk(dir, base, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else out.push({ local: p, cloud: path.posix.join('parks', path.posix.join(...path.relative(base, p).split(path.sep))) });
  }
  return out;
}

(async () => {
  const manager = new CloudBaseManager({ envId, secretId, secretKey });
  const files = walk(LOCAL_DIR, LOCAL_DIR);
  console.log('待上传文件数:', files.length);
  let done = 0;
  for (const f of files) {
    try {
      await manager.storage.uploadFile({ cloudPath: f.cloud, filePath: f.local });
      done++;
      if (done % 20 === 0) console.log('进度', done, '/', files.length);
    } catch (e) {
      console.error('上传失败:', f.cloud, '-', e.message);
    }
  }
  console.log(`完成：成功 ${done}/${files.length}`);
  console.log('下一步：把 src/config/cloud.ts 里的 CLOUD_ENV 改成上面的环境ID，然后重新 build。');
})();

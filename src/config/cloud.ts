// 微信云开发环境 ID
// 在微信开发者工具「云开发」控制台开通后，把下面的值替换成你的环境 ID（形如 xxx-1a2b3c4d5e）。
export const CLOUD_ENV = 'REPLACE_WITH_YOUR_ENV_ID';

// 生成云存储文件的 cloud:// 地址，可直接用于 <Image src>
// 文件需先通过 scripts/upload-cloud.js 上传到云存储
export function cloudFile(path: string): string {
  const normalized = path.replace(/^\/+/, '');
  return `cloud://${CLOUD_ENV}/${normalized}`;
}

export function isCloudReady(): boolean {
  return !!CLOUD_ENV && !CLOUD_ENV.startsWith('REPLACE_WITH_');
}

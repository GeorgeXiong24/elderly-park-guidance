# 上传微信小程序 · 操作指南

## 已修复的三个代码质量问题

| 检查项 | 状态 | 说明 |
|---|---|---|
| 主包大小 < 1.5 M | 通过 | 主包从 136 MB 降到 **1.06 MB** |
| 启用组件按需注入 | 通过 | `app.config.ts` 已加 `lazyCodeLoading: 'requiredComponents'` |
| 图片/音频单文件 ≤ 200 K | 通过 | 包内最大图片 61 KB，无 >200 KB 文件 |

做法：26 张封面压缩后留在主包；约 286 张详情图改为微信云开发云存储 `cloud://` 引用，不占用包体。

## 你还需要做的 3 步（图片才能显示）

### 1. 开通云开发并拿到环境 ID
- 微信开发者工具打开本项目 → 点工具栏「云开发」→ 开通（选免费基础版）。
- 控制台顶部复制「环境 ID」，形如 `xxx-1a2b3c4d5e`。

### 2. 把环境 ID 写进代码
- 打开 `src/config/cloud.ts`，把 `CLOUD_ENV` 的值改成你的环境 ID：
  ```ts
  export const CLOUD_ENV = 'xxx-1a2b3c4d5e';
  ```

### 3. 上传详情图到云存储
需要一个腾讯云 API 密钥（SecretId/SecretKey）：
- 浏览器打开 https://console.cloud.tencent.com/cam/capi → 新建密钥，复制 SecretId / SecretKey。
- 在项目目录执行（PowerShell，替换成你的值）：
  ```powershell
  $env:TB_ENV_ID="你的环境ID"
  $env:TENCENT_SECRET_ID="你的SecretId"
  $env:TENCENT_SECRET_KEY="你的SecretKey"
  node scripts/upload-cloud.js
  ```
- 看到「完成：成功 286/286」即上传完毕。

### 4. 重新构建并上传
```powershell
npm run build:weapp
```
然后在微信开发者工具点「上传」。代码质量扫描应全部变绿。

## 备注
- `cloud://` 图片无需在小程序后台配置 downloadFile 合法域名。
- 详情页 `shenzhen-wan/8.jpg` 原文件是损坏的 HTML 占位，已自动跳过（深圳湾详情图为 11 张，其余 12 张）。
- 本地原图仍保留在 `src/assets/parks/`（不再打进包），压缩待上传版本在 `cloud-upload/`。

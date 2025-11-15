# 自动化部署配置指南

## 🚀 CI/CD 流程概览

本项目已配置完整的自动化部署流程，使用 GitHub Actions 实现：

### 📋 流程说明

1. **CI (Continuous Integration)**
   - 代码检查：TypeScript 类型检查、ESLint 代码规范检查
   - 项目构建：Vite 构建优化

2. **CD (Continuous Deployment)**
   - **主分支 (main)**：自动部署到 GitHub Pages
   - **开发分支 (dev)**：部署到预览环境
   - **Pull Request**：仅运行 CI 检查，不部署

## ⚙️ 环境配置

### 1. GitHub Pages 设置

在 GitHub 仓库设置中启用 GitHub Pages：

1. 进入仓库 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 保存设置

### 2. 必需的权限配置

确保仓库有以下权限：
- `Contents: Read` (默认)
- `Pages: Write` (用于部署)
- `Id-token: Write` (用于 OIDC 认证)

### 3. 环境变量 (可选)

在 Settings → Secrets and variables → Actions 中配置：

#### 生产环境变量
```
# 应用配置
VITE_APP_TITLE=Verse3
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=https://api.example.com

# 第三方服务
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

#### 开发环境变量
```
# 开发配置
VITE_APP_TITLE=Verse3 (Dev)
VITE_API_BASE_URL=https://dev-api.example.com
```

## 🔄 触发条件

| 事件 | 分支 | 执行流程 | 部署目标 |
|------|------|----------|----------|
| Push | main | CI + CD | GitHub Pages (生产) |
| Push | dev | CI + CD | Preview (预览) |
| Pull Request | main | CI | 无部署 |
| Push | other | CI | 无部署 |

## 📊 构建产物

### 上传的 Artifacts
- `build-files`: 构建产物 (保留 7 天)

### 部署路径
- **生产环境**: `https://1900s88keys.github.io/Verse3/`
- **预览环境**: 通过 GitHub Actions 日志查看

## 🛠️ 本地开发

### 安装依赖
```bash
npm install
```

### 开发服务器
```bash
npm run dev
```

### 构建检查
```bash
npm run build
npm run type-check
npm run lint
```

## 🔧 自定义配置

### 修改 Node.js 版本
在 `.github/workflows/ci-cd.yml` 中修改：
```yaml
env:
  NODE_VERSION: '22'  # 修改为需要的版本
```

### 添加部署目标
可以扩展工作流以支持其他部署平台：
- Vercel
- Netlify  
- AWS S3
- 阿里云 OSS
- 腾讯云 COS

### 添加通知
在部署完成后发送通知：
- Slack
- Discord
- 邮件
- 企业微信

## 🚨 故障排除

### 常见问题

1. **构建失败**
   - 检查 `package.json` 中的 engines.node 版本
   - 确认所有依赖都已正确安装

3. **构建失败**
   - 检查 `package.json` 中的 engines.node 版本
   - 确认所有依赖都已正确安装

4. **部署失败**
   - 检查 GitHub Pages 权限设置
   - 确认仓库是公开的或启用了 GitHub Pages for private repos

### 调试技巧

1. **查看详细日志**
   - 进入 GitHub Actions 页面
   - 点击具体的工作流运行
   - 查看各个步骤的详细输出

2. **本地复现**
   ```bash
   # 复制 CI 环境
   docker run -it --rm -v $(pwd):/app -w /app node:20-alpine sh
   
   # 在容器内执行
   npm ci
   npm run build
   ```

## 📈 性能优化

### 构建优化
- 启用 Vite 代码分割
- 压缩图片资源
- 启用 Gzip 压缩

### 部署优化
- 使用 CDN 加速
- 配置缓存策略
- 启用 HTTP/2

## 🔐 安全考虑

1. **敏感信息**
   - 使用 GitHub Secrets 存储密钥
   - 不在代码中硬编码敏感信息

2. **依赖安全**
   - 定期更新依赖包
   - 使用 `npm audit` 检查安全漏洞

3. **访问控制**
   - 限制分支保护规则
   - 配置代码审查流程

---

## 📞 支持

如有问题，请：
1. 查看 GitHub Actions 运行日志
2. 检查本文档的故障排除部分
3. 提交 Issue 到仓库
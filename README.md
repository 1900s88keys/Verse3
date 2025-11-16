# Verse3

一个基于 Vue 3 + TypeScript + Vite 的现代化前端项目，采用响应式布局设计和组件化架构。

## 🚀 技术栈

- **框架**: Vue 3.5.22
- **语言**: TypeScript 5.9
- **构建工具**: Vite 7.1
- **路由**: Vue Router 4.6
- **样式**: CSS + Tailwind CSS
- **测试**: Vitest + Playwright
- **代码规范**: ESLint + Prettier
- **开发工具**: Trae IDE

## 📁 项目结构

```
Verse3/
├── .trae/                    # Trae IDE 配置规则
│   └── rules/                # 代码规则配置
│       ├── code-rule.mdc
│       ├── eslint-prettier-rule.mdc
│       ├── tailwind-css-theme.mdc
│       ├── tailwind-css.mdc
│       ├── tailwind-utility-first.mdc
│       └── typescript-strict-mode.mdc
├── e2e/                      # 端到端测试
│   ├── tsconfig.json
│   └── vue.spec.ts
├── public/                   # 静态资源
│   ├── favicon.ico
├── src/                      # 源代码目录
│   ├── app/                  # 应用核心
│   │   ├── App.ts           # 应用入口
│   │   ├── App.vue          # 根组件
│   │   └── router/          # 路由配置
│   │       └── Router.ts
│   ├── features/            # 功能模块
│   ├── pages/               # 页面组件
│   │   ├── home-page/      # 首页模块
│   │   │   ├── ui/         # UI组件
│   │   │   ├── store/      # 状态管理
│   │   │   ├── model/      # 数据模型
│   │   │   └── index.vue   # 页面入口
│   │   └── layout-demo/    # 布局演示页面
│   └── shared/              # 共享资源
│       ├── components/      # 通用公共组件
│       │   └── layout/     # 布局组件
│       │       ├── src/
│       │       │   ├── LayoutSidebar.vue  # 侧边栏组件
│       │       │   ├── LayoutMain.vue     # 主内容区
│       │       │   └── index.ts          # 组件导出
│       │       └── package.json
│       ├── images/          # 图片资源
│       └── style/           # 公共样式文件
│           ├── app.css
│           └── vars.css
├── test/                    # 测试配置
├── .editorconfig           # 编辑器配置
├── .eslint.config.ts       # ESLint 配置
├── .gitignore             # Git 忽略文件
├── .prettierrc.json       # Prettier 配置
├── .vscode/               # VS Code 配置
│   └── extensions.json    # 推荐扩展
├── index.html             # HTML 入口
├── package.json           # 项目依赖
├── playwright.config.ts   # Playwright 配置
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── vitest.config.ts       # Vitest 配置
```

## 🎨 布局系统

### 核心组件架构

项目采用现代化的左侧菜单布局设计，采用组件化架构，包含以下核心组件：

#### 1. 布局侧边栏 (`LayoutSidebar.vue`)

- **功能**: 左侧导航菜单，支持折叠/展开
- **特色**:
  - 每个菜单项包含图标、标题和描述
  - 支持菜单项高亮显示和激活状态
  - 渐变背景设计，视觉效果出色
  - 响应式折叠功能，收缩时图标居中显示
  - 平滑的过渡动画效果
  - 分类菜单结构，支持多层级组织

#### 2. 主内容区域 (`LayoutMain.vue`)

- **功能**: 右侧内容展示区域
- **包含**:
  - 顶部导航栏（面包屑、搜索、通知）
  - 页面内容区域
  - 路由视图切换
  - 过渡动画效果

### 页面路由

当前配置的页面路由：

- **首页** (`/`) - 欢迎页面
- **布局演示** (`/demo`) - 布局系统展示页面
- **仪表盘** (`/dashboard`) - 数据统计展示
- **用户管理** (`/users`) - 用户列表管理

### 响应式设计

- **桌面端**: 左侧菜单固定显示，宽度 280px
- **平板端**: 菜单可折叠，优化触摸交互
- **移动端**: 菜单默认隐藏，点击触发显示

### 布局组件特性

#### LayoutSidebar 组件特性：

1. **智能折叠**:
   - 折叠时只显示图标，隐藏文字内容
   - 图标完美居中对齐
   - 平滑的过渡动画

2. **菜单分类**:
   - 支持多级菜单分类
   - 分类标题在折叠时隐藏
   - 菜单项支持激活状态高亮

3. **视觉效果**:
   - 渐变背景设计
   - 悬停效果和动画
   - 现代化的卡片式菜单项

4. **交互体验**:
   - 点击折叠按钮切换状态
   - 菜单项点击高亮
   - 响应式布局适配

## 🛠️ 开发环境要求

- **Node.js**: ^20.19.0 || >=22.12.0
- **包管理器**: npm

## 📦 安装与运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动后访问: http://localhost:5174

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 🧪 测试

### 单元测试

```bash
npm run test:unit
```

### 端到端测试

```bash
npm run test:e2e
```

## 🔧 代码规范

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

### 类型检查

```bash
npm run type-check
```

## ⚙️ 开发注意事项

### 1. 布局系统使用

- 所有页面都应该在 `LayoutSidebar` 和 `LayoutMain` 组件构建的布局内渲染
- 新增页面需要在 `app/router/Router.ts` 中配置路由
- 菜单项配置在 `LayoutSidebar.vue` 中的 `menuItems` 数组
- 使用 `/demo` 路由查看布局系统演示

### 2. 组件开发规范

- 使用 Composition API 和 `<script setup>` 语法
- 页面组件放在 `pages/` 目录下对应的模块文件夹，采用 `page-name/` 结构
- 通用组件放在 `shared/components/` 目录，推荐使用子包结构
- 组件文件命名采用 PascalCase
- 布局相关组件统一放在 `shared/components/layout/` 目录

### 3. 样式管理

- 使用 CSS 变量进行主题管理
- 样式文件统一放在 `shared/style/` 目录
- 支持响应式设计和过渡动画
- 遵循移动优先的设计原则
- 布局组件样式使用 scoped CSS 避免样式冲突

### 4. 路由配置

- 使用嵌套路由结构，所有页面都是主布局的子路由
- 支持懒加载优化性能
- 路由命名采用小写字母和连字符
- 页面组件使用 `index.vue` 作为入口文件

### 5. TypeScript 配置

- 启用严格模式检查
- 使用项目引用配置，分离不同环境的 TypeScript 配置
- 支持路径别名：`@` 指向 `src` 目录
- 组件类型定义完整，确保类型安全

### 6. 测试策略

- 单元测试使用 Vitest，测试文件放在 `__tests__/` 目录
- E2E 测试使用 Playwright，测试文件放在 `e2e/` 目录
- 组件测试与组件文件同目录存放
- 布局组件需要测试响应式行为

### 7. 构建优化

- 使用 Vite 进行快速构建和热更新
- 支持代码分割和懒加载
- 集成 Vue DevTools 进行开发调试
- 布局组件支持按需加载

### 8. Git 规范

- 使用 `.gitignore` 忽略不必要的文件
- 配置 `.gitattributes` 统一文件处理方式
- 建议使用语义化提交信息
- Trae IDE 提供了代码规则配置，确保代码质量

### 9. Trae IDE 集成

- 项目配置了 Trae IDE 规则文件在 `.trae/rules/` 目录
- 支持 TypeScript 严格模式、ESLint + Prettier、Tailwind CSS 等
- 自动代码格式化和错误检查
- 组件开发时遵循 Trae IDE 的最佳实践建议

## 🎯 快速开始

1. **克隆项目**

   ```bash
   git clone <repository-url>
   cd Verse3
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   ```

4. **访问应用**
   打开浏览器访问 http://localhost:5173/demo 查看布局演示

5. **开始开发**
   - 在 `pages/` 目录下创建新页面，使用 `page-name/index.vue` 结构
   - 在 `app/router/Router.ts` 中配置路由
   - 在 `LayoutSidebar.vue` 中添加菜单项
   - 使用 Trae IDE 进行开发，享受智能代码提示和错误检查

6. **查看演示**
   - 访问 `/demo` 路由查看完整的布局系统演示
   - 测试侧边栏折叠/展开功能
   - 体验响应式设计效果

## 📚 相关文档

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Vue Router 官方文档](https://router.vuejs.org/)

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

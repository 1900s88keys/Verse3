# Layout 布局组件

基于 Naive UI 设计理念实现的 Vue 3 布局组件系统，提供了灵活、可定制的页面布局解决方案。

## 特性

- 🎨 **现代化设计** - 参考主流 UI 设计规范，简洁美观
- 🔧 **高度可定制** - 支持多种布局模式和主题配置
- 📱 **响应式布局** - 完美适配桌面端和移动端
- ⚡ **TypeScript 支持** - 完整的类型定义和智能提示
- 🎯 **开箱即用** - 提供预设配置，快速上手

## 组件结构

```
Layout/
├── Layout.vue          # 主布局容器
├── Header.vue          # 顶部导航栏
├── Sidebar.vue         # 侧边栏
├── Content.vue         # 内容区域
├── Footer.vue          # 底部信息栏
├── styles.css          # 全局样式
└── index.ts           # 入口文件
```

## 基础用法

### 完整布局

```vue
<template>
  <Layout>
    <template #header>
      <LayoutHeader title="应用标题" />
    </template>
    
    <template #sidebar>
      <LayoutSidebar :menu-items="menuItems" />
    </template>
    
    <template #content>
      <LayoutContent>
        <!-- 页面内容 -->
      </LayoutContent>
    </template>
    
    <template #footer>
      <LayoutFooter company-name="公司名称" />
    </template>
  </Layout>
</template>

<script setup>
import { Layout, LayoutHeader, LayoutSidebar, LayoutContent, LayoutFooter } from '@/shared/components/layout'

const menuItems = [
  { key: 'home', label: '首页' },
  { key: 'dashboard', label: '仪表板' }
]
</script>
```

### 简化布局

```vue
<template>
  <Layout :has-sidebar="false" :has-footer="false">
    <template #header>
      <LayoutHeader title="简单页面" />
    </template>
    
    <template #content>
      <LayoutContent>
        <!-- 页面内容 -->
      </LayoutContent>
    </template>
  </Layout>
</template>
```

## API 文档

### Layout Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| hasHeader | boolean | true | 是否显示顶部 |
| hasSidebar | boolean | true | 是否显示侧边栏 |
| hasFooter | boolean | true | 是否显示底部 |
| sidebarCollapsed | boolean | false | 侧边栏是否折叠 |
| layoutDirection | 'vertical' \| 'horizontal' | 'vertical' | 布局方向 |

### LayoutHeader Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | '' | 标题文字 |
| showToggle | boolean | true | 是否显示折叠按钮 |
| showUser | boolean | true | 是否显示用户信息 |
| userName | string | 'User' | 用户名称 |
| height | number | 64 | 高度(px) |
| bordered | boolean | true | 是否显示边框 |
| fixed | boolean | false | 是否固定定位 |

### LayoutSidebar Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| collapsed | boolean | false | 是否折叠 |
| width | number | 240 | 展开宽度(px) |
| collapsedWidth | number | 64 | 折叠宽度(px) |
| collapsible | boolean | true | 是否可折叠 |
| bordered | boolean | true | 是否显示边框 |
| menuItems | MenuItem[] | [] | 菜单项配置 |
| activeKey | string | '' | 当前激活的菜单项 |

### LayoutContent Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| loading | boolean | false | 是否加载中 |
| loadingText | string | '加载中...' | 加载提示文字 |
| hasError | boolean | false | 是否显示错误状态 |
| errorTitle | string | '出错了' | 错误标题 |
| errorDescription | string | '抱歉，页面加载失败' | 错误描述 |
| showRetry | boolean | true | 是否显示重试按钮 |
| retryText | string | '重试' | 重试按钮文字 |
| padding | number \| string | 24 | 内边距 |
| minHeight | string | '400px' | 最小高度 |

### LayoutFooter Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| companyName | string | 'Verse3' | 公司名称 |
| version | string | 'v1.0.0' | 版本号 |
| height | number | 64 | 高度(px) |
| bordered | boolean | true | 是否显示边框 |
| fixed | boolean | false | 是否固定定位 |
| links | FooterLink[] | [] | 链接配置 |

## 事件

### LayoutHeader Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| toggle | - | 点击折叠按钮时触发 |

### LayoutSidebar Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| collapse | (collapsed: boolean) | 折叠状态改变时触发 |
| menu-click | (item: MenuItem) | 点击菜单项时触发 |

### LayoutContent Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| retry | - | 点击重试按钮时触发 |

## 插槽

### Layout 插槽

| 插槽名 | 说明 |
|--------|------|
| header | 顶部内容 |
| sidebar | 侧边栏内容 |
| content | 主内容区域 |
| footer | 底部内容 |

### LayoutHeader 插槽

| 插槽名 | 说明 |
|--------|------|
| left | 左侧内容区域 |
| center | 中间内容区域 |
| right | 右侧内容区域 |

### LayoutFooter 插槽

| 插槽名 | 说明 |
|--------|------|
| left | 左侧内容区域 |
| center | 中间内容区域 |
| right | 右侧内容区域 |

## 主题配置

### 使用预设主题

```typescript
import { setLayoutTheme } from '@/shared/components/layout'

// 暗色主题
setLayoutTheme('dark')

// 紧凑主题
setLayoutTheme('compact')
```

### 自定义 CSS 变量

```css
:root {
  --layout-primary-color: #1890ff;
  --layout-text-color: #333;
  --layout-background-color: #f5f5f5;
  /* 更多变量... */
}
```

## 响应式工具

```typescript
import { useResponsive } from '@/shared/components/layout'

const { isMobile, isTablet, isDesktop } = useResponsive()
```

## 布局预设

```typescript
import { layoutPresets } from '@/shared/components/layout'

// 管理后台布局
<Layout v-bind="layoutPresets.admin">
  <!-- 内容 -->
</Layout>

// 门户网站布局
<Layout v-bind="layoutPresets.portal">
  <!-- 内容 -->
</Layout>

// 移动端布局
<Layout v-bind="layoutPresets.mobile">
  <!-- 内容 -->
</Layout>
```

## 最佳实践

1. **统一布局结构** - 在 App.vue 中使用完整的布局结构
2. **合理使用插槽** - 通过插槽自定义特定区域的内容
3. **响应式设计** - 根据屏幕尺寸调整布局配置
4. **主题一致性** - 使用统一的主题配置保持视觉一致性

## 更新日志

### v1.0.0

- ✨ 初始版本发布
- 🎨 完整的布局组件系统
- 📱 响应式设计支持
- 🎯 TypeScript 类型支持
- 🔧 主题和样式定制

## 贡献

欢迎提交 Issue 和 Pull Request 来完善这个组件库。
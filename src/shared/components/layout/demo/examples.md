# 布局组件使用示例

## 快速开始

### 1. 基础布局

```vue
<template>
  <Layout>
    <template #header>
      <LayoutHeader title="我的应用" />
    </template>

    <template #sidebar>
      <LayoutSidebar :menu-items="menuItems" />
    </template>

    <template #content>
      <LayoutContent>
        <h1>欢迎来到我的应用</h1>
        <p>这里是主要内容区域</p>
      </LayoutContent>
    </template>

    <template #footer>
      <LayoutFooter company-name="我的公司" />
    </template>
  </Layout>
</template>

<script setup>
import {
  Layout,
  LayoutHeader,
  LayoutSidebar,
  LayoutContent,
  LayoutFooter,
} from '@/shared/components/layout'

const menuItems = [
  { key: 'dashboard', label: '仪表板' },
  { key: 'users', label: '用户管理' },
  { key: 'settings', label: '设置' },
]
</script>
```

### 2. 响应式布局

```vue
<template>
  <Layout :has-sidebar="!isMobile" :sidebar-collapsed="isMobile || sidebarCollapsed">
    <template #header>
      <LayoutHeader title="响应式应用" :show-toggle="!isMobile" />
    </template>

    <template #sidebar v-if="!isMobile">
      <LayoutSidebar :menu-items="menuItems" />
    </template>

    <template #content>
      <LayoutContent>
        <!-- 移动端会自动隐藏侧边栏，内容占满全宽 -->
      </LayoutContent>
    </template>
  </Layout>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { Layout, LayoutHeader, LayoutSidebar, LayoutContent } from '@/shared/components/layout'

const isMobile = ref(false)
const sidebarCollapsed = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
```

### 3. 自定义主题

```vue
<template>
  <Layout>
    <!-- 使用自定义主题的布局 -->
  </Layout>
</template>

<script setup>
import { onMounted } from 'vue'
import { setLayoutTheme } from '@/shared/components/layout'

onMounted(() => {
  // 应用暗色主题
  setLayoutTheme('dark')

  // 或者自定义 CSS 变量
  document.documentElement.style.setProperty('--layout-primary-color', '#722ed1')
  document.documentElement.style.setProperty('--layout-background-color', '#f0f2f5')
})
</script>

<style>
:root {
  --layout-primary-color: #1890ff;
  --layout-success-color: #52c41a;
  --layout-warning-color: #faad14;
  --layout-error-color: #f5222d;
  --layout-text-color: #333333;
  --layout-text-color-secondary: #666666;
  --layout-background-color: #ffffff;
  --layout-header-background: #ffffff;
  --layout-sidebar-background: #ffffff;
  --layout-footer-background: #ffffff;
  --layout-border-color: #e8e8e8;
}
</style>
```

### 4. 带状态管理的布局

```vue
<template>
  <Layout :sidebar-collapsed="layoutStore.sidebarCollapsed" @toggle="layoutStore.toggleSidebar">
    <template #header>
      <LayoutHeader
        title="状态管理应用"
        :user-name="userStore.name"
        @toggle="layoutStore.toggleSidebar"
      />
    </template>

    <template #sidebar>
      <LayoutSidebar
        :collapsed="layoutStore.sidebarCollapsed"
        :menu-items="menuItems"
        :active-key="layoutStore.activeMenu"
        @menu-click="layoutStore.setActiveMenu"
        @collapse="layoutStore.setSidebarCollapsed"
      />
    </template>

    <template #content>
      <LayoutContent :loading="contentStore.loading">
        <RouterView />
      </LayoutContent>
    </template>
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import { useContentStore } from '@/stores/content'
import { Layout, LayoutHeader, LayoutSidebar, LayoutContent } from '@/shared/components/layout'

const layoutStore = useLayoutStore()
const userStore = useUserStore()
const contentStore = useContentStore()

const menuItems = computed(() => [
  { key: 'home', label: '首页' },
  { key: 'profile', label: '个人资料' },
  { key: 'settings', label: '设置' },
])
</script>
```

### 5. 布局预设

```vue
<template>
  <!-- 管理后台布局 -->
  <Layout v-bind="layoutPresets.admin">
    <template #header>
      <LayoutHeader title="管理后台" />
    </template>
    <template #content>
      <LayoutContent>
        <!-- 管理后台内容 -->
      </LayoutContent>
    </template>
  </Layout>

  <!-- 门户网站布局 -->
  <Layout v-bind="layoutPresets.portal">
    <template #header>
      <LayoutHeader title="门户网站" />
    </template>
    <template #content>
      <LayoutContent>
        <!-- 门户网站内容 -->
      </LayoutContent>
    </template>
  </Layout>

  <!-- 移动端布局 -->
  <Layout v-bind="layoutPresets.mobile">
    <template #header>
      <LayoutHeader title="移动应用" />
    </template>
    <template #content>
      <LayoutContent>
        <!-- 移动端内容 -->
      </LayoutContent>
    </template>
  </Layout>
</template>

<script setup>
import { layoutPresets } from '@/shared/components/layout'
import { Layout, LayoutHeader, LayoutContent } from '@/shared/components/layout'
</script>
```

## 高级用法

### 动态菜单

```vue
<template>
  <Layout>
    <template #sidebar>
      <LayoutSidebar
        :menu-items="dynamicMenuItems"
        :active-key="currentRoute"
        @menu-click="handleMenuClick"
      />
    </template>

    <template #content>
      <LayoutContent>
        <RouterView />
      </LayoutContent>
    </template>
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Layout, LayoutSidebar, LayoutContent } from '@/shared/components/layout'

const route = useRoute()
const router = useRouter()

const currentRoute = computed(() => route.name)

const dynamicMenuItems = computed(() => {
  const baseItems = [{ key: 'dashboard', label: '仪表板' }]

  // 根据用户权限动态添加菜单
  if (hasPermission('admin')) {
    baseItems.push({ key: 'admin', label: '管理' })
  }

  if (hasPermission('user')) {
    baseItems.push({ key: 'profile', label: '个人资料' })
  }

  return baseItems
})

const handleMenuClick = (item) => {
  router.push({ name: item.key })
}

const hasPermission = (permission) => {
  // 检查用户权限的逻辑
  return true
}
</script>
```

### 布局切换

```vue
<template>
  <div>
    <div class="layout-switcher">
      <button
        v-for="preset in presets"
        :key="preset.name"
        @click="currentPreset = preset.name"
        :class="{ active: currentPreset === preset.name }"
      >
        {{ preset.label }}
      </button>
    </div>

    <Layout v-bind="currentPresetConfig">
      <!-- 布局内容 -->
    </Layout>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { layoutPresets } from '@/shared/components/layout'
import { Layout } from '@/shared/components/layout'

const currentPreset = ref('admin')

const presets = [
  { name: 'admin', label: '管理后台' },
  { name: 'portal', label: '门户网站' },
  { name: 'mobile', label: '移动端' },
]

const currentPresetConfig = computed(() => {
  return layoutPresets[currentPreset.value]
})
</script>
```

## 最佳实践

1. **统一布局入口** - 在 App.vue 中统一使用 Layout 组件
2. **合理使用插槽** - 通过插槽实现灵活的内容定制
3. **响应式优先** - 始终考虑移动端和桌面端的适配
4. **主题一致性** - 使用统一的主题配置
5. **性能优化** - 合理使用 v-show 和 v-if 控制组件显示

## 常见问题

### Q: 如何自定义侧边栏宽度？

A: 通过 `width` 和 `collapsedWidth` 属性设置：

```vue
<LayoutSidebar :width="280" :collapsed-width="80" />
```

### Q: 如何实现多级菜单？

A: 扩展 MenuItem 接口，添加 children 属性：

```typescript
interface MenuItem {
  key: string
  label: string
  icon?: string
  children?: MenuItem[]
}
```

### Q: 如何实现布局动画？

A: 使用 CSS 过渡和 Vue 的 transition 组件：

```css
.layout-sidebar {
  transition: width 0.3s ease;
}
```

### Q: 如何实现布局持久化？

A: 使用 localStorage 保存布局状态：

```javascript
const savedCollapsed = localStorage.getItem('sidebar-collapsed')
sidebarCollapsed.value = savedCollapsed === 'true'
```

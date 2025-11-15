<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Layout, {
  type MenuItem,
  LayoutSidebar,
  LayoutContent,
  LayoutFooter,
} from '@/shared/components/layout/Layout'

const sidebarCollapsed = ref(false)
const activeMenuKey = ref('home')

const menuItems: MenuItem[] = [
  {
    key: 'home',
    label: '首页',
    category: '基础',
    description: '应用首页和概览',
    image: '/images/home.svg',
  },
  {
    key: 'dashboard',
    label: '仪表板',
    category: '基础',
    description: '数据统计和图表展示',
    image: '/images/dashboard.svg',
  },
  {
    key: 'components',
    label: '组件库',
    category: '开发',
    description: '可复用的UI组件集合',
    image: '/images/components.svg',
  },
  {
    key: 'animation',
    label: '动画',
    category: '效果',
    description: '关键帧动画效果',
    image: '/images/animation.svg',
  },
  {
    key: 'geometry',
    label: '几何图形',
    category: '3D',
    description: '3D几何体和形状',
    image: '/images/geometry.svg',
  },
  {
    key: 'materials',
    label: '材质',
    category: '3D',
    description: '表面材质和纹理',
    image: '/images/materials.svg',
  },
  {
    key: 'lighting',
    label: '光照',
    category: '3D',
    description: '光源和阴影效果',
    image: '/images/lighting.svg',
  },
  {
    key: 'settings',
    label: '设置',
    category: '系统',
    description: '系统配置和偏好设置',
    image: '/images/settings.svg',
  },
]
</script>

<template>
  <Layout :sidebar-collapsed="sidebarCollapsed">
    <template #sidebar>
      <LayoutSidebar
        :collapsed="sidebarCollapsed"
        :menu-items="menuItems"
        :active-key="activeMenuKey"
        :collapsed-width="0"
        title="3D Journey"
        @collapse="sidebarCollapsed = $event"
      />
    </template>

    <template #content>
      <LayoutContent :loading="false" :has-error="false">
        <RouterView />
      </LayoutContent>
    </template>

    <template #footer>
      <LayoutFooter
        company-name="Verse3"
        version="v1.0.0"
        :links="[
          { key: 'docs', label: '文档', url: '#' },
          { key: 'github', label: 'GitHub', url: 'https://github.com' },
        ]"
      />
    </template>
  </Layout>
</template>

<style scoped>
.header-nav {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #1890ff;
}
</style>

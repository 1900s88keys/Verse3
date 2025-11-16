<script setup lang="ts">
import { watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { menus } from '@/app/menus/Menus'
import Layout, {
  LayoutSidebar,
  LayoutContent,
  LayoutHeader,
} from '@/shared/components/layout/Layout'

const route = useRoute()

// 监听路由变化，同步更新菜单状态
watch(
  () => route.path,
  (newPath) => {
    menus.changeActiveMenuKey(newPath)
  },
  { immediate: true },
)
</script>

<template>
  <Layout :sidebar-collapsed="menus.sidebarCollapsed">
    <template #header>
      <LayoutHeader title="3D Journey" :show-toggle="true" />
    </template>

    <template #sidebar>
      <LayoutSidebar
        :collapsed="menus.sidebarCollapsed"
        :menu-items="menus.menuItems"
        :active-key="menus.activeMenuKey"
        title="3D Journey"
        @collapse="menus.onCollapseChange"
        @menu-click="menus.handleMenuClick"
      />
    </template>

    <template #content>
      <LayoutContent :loading="false" :has-error="false">
        <RouterView />
      </LayoutContent>
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

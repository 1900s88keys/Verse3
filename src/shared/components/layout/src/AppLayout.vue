<template>
  <div class="layout" :class="layoutClass">
    <slot name="header"> </slot>

    <div class="layout-container">
      <slot name="sidebar"> </slot>

      <div class="layout-main">
        <slot name="content"> </slot>
      </div>
    </div>

    <slot name="footer"> </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

import { useMobileSidebar } from '../composables/useMobileSidebar'

import type { LayoutProps } from '../type/types'

const props = withDefaults(defineProps<LayoutProps>(), {
  hasHeader: true,
  hasSidebar: true,
  hasFooter: true,
  sidebarCollapsed: false,
  layoutDirection: 'vertical',
})

// 移动端侧边栏状态管理
const mobileSidebarState = useMobileSidebar()

// 提供给子组件使用
provide('mobileSidebarState', mobileSidebarState)

const layoutClass = computed(() => ({
  'layout-horizontal': props.layoutDirection === 'horizontal',
  'layout-vertical': props.layoutDirection === 'vertical',
}))
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.layout-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.layout-main.with-sidebar {
  margin-left: 0;
}

.layout-horizontal {
  flex-direction: row;
}

.layout-horizontal .layout-container {
  flex-direction: column;
}
</style>

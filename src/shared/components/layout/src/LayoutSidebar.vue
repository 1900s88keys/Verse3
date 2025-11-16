<template>
  <aside class="layout-sidebar" :class="sidebarClass" :style="sidebarStyle">
    <div v-if="title && !collapsed" class="sidebar-header">
      <h2 class="sidebar-title">{{ title }}</h2>
    </div>
    <div v-if="!collapsed" class="sidebar-content">
      <slot>
        <div class="sidebar-menu">
          <template v-for="category in categorizedMenuItems" :key="category.name">
            <div v-if="category.name" class="menu-category">
              <h3 class="category-title">{{ category.name }}</h3>
            </div>
            <div class="menu-grid">
              <div
                v-for="item in category.items"
                :key="item.key"
                class="menu-item-card"
                :class="{ 'menu-item-active': activeKey === item.key }"
                @click="handleMenuClick(item)"
              >
                <div class="menu-item-image">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.label"
                    @error="handleImageError"
                  />
                  <div v-else class="menu-item-placeholder">
                    <component v-if="item.icon" :is="item.icon" size="24" />
                  </div>
                </div>
                <div class="menu-item-content">
                  <div class="menu-item-title">{{ item.label }}</div>
                  <div v-if="item.description && !collapsed" class="menu-item-description">
                    {{ item.description }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </slot>
    </div>

    <div v-if="collapsible" class="sidebar-trigger" @click="handleCollapse">
      <div class="trigger-icon" :class="{ 'trigger-icon-collapsed': collapsed }">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { MenuItem, SidebarProps } from '../type/types'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsed: false,
  width: 240,
  collapsedWidth: 64,
  collapsible: true,
  bordered: true,
  menuItems: () => [],
  activeKey: '',
  title: '导航菜单',
})

const emit = defineEmits<{
  collapse: [collapsed: boolean]
  'menu-click': [item: MenuItem]
}>()

// 按分类组织菜单项
const categorizedMenuItems = computed(() => {
  const categoryMap = new Map<string, MenuItem[]>()

  props.menuItems.forEach((item) => {
    const category = item.category || ''
    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    categoryMap.get(category)!.push(item)
  })

  return Array.from(categoryMap.entries()).map(([name, items]) => ({
    name: name || undefined,
    items,
  }))
})

const sidebarClass = computed(() => ({
  'sidebar-collapsed': props.collapsed,
  'sidebar-bordered': props.bordered,
}))

const sidebarStyle = computed(() => ({
  width: props.collapsed ? `${props.collapsedWidth}px` : `${props.width}px`,
}))

const handleCollapse = () => {
  emit('collapse', !props.collapsed)
}

const handleMenuClick = (item: MenuItem) => {
  if (item.disabled) return
  emit('menu-click', item)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.layout-sidebar {
  position: relative;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  transition: width 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-bordered {
  border-right: 1px solid #e8e8e8;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px 16px 16px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  padding: 0;
  position: relative;
  padding-bottom: 8px;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-collapsed .sidebar-title {
  opacity: 0;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  transition: padding 0.3s ease-in-out;
}

.sidebar-collapsed .sidebar-content {
  padding: 8px;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.menu-category {
  margin-bottom: 8px;
}

.category-title {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  padding: 0 0 8px 0;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-collapsed .category-title {
  opacity: 0;
  height: 0;
  overflow: hidden;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.sidebar-collapsed .menu-grid {
  grid-template-columns: 1fr;
}

.menu-item-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  position: relative;
}

.sidebar-collapsed .menu-item-card {
  flex-direction: row;
  align-items: center;
  height: 48px;
}

.menu-item-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  transform: translateY(-1px);
}

.menu-item-active {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.menu-item-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #1890ff;
}

.sidebar-collapsed .menu-item-active::before {
  width: 3px;
  height: 100%;
  right: auto;
}

.menu-item-image {
  width: 100%;
  height: 100px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease-in-out;
}

.sidebar-collapsed .menu-item-image {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  margin: 0 8px;
}

.menu-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;
}

.menu-item-card:hover .menu-item-image img {
  transform: scale(1.05);
}

.menu-item-placeholder {
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.sidebar-collapsed .menu-item-placeholder {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.menu-item-content {
  padding: 12px;
  flex: 1;
}

.sidebar-collapsed .menu-item-content {
  display: none;
}

.menu-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  margin-bottom: 4px;
}

.menu-item-description {
  font-size: 12px;
  color: #666;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sidebar-trigger {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.sidebar-trigger:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.trigger-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.trigger-icon svg {
  display: block;
  margin: 0;
  padding: 0;
}

.trigger-icon-collapsed {
  transform: rotate(180deg);
}

/* 滚动条样式 */
.sidebar-content::-webkit-scrollbar {
  width: 4px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}
</style>

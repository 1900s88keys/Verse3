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
  background: var(--layout-sidebar-background);
  border-right: 1px solid var(--layout-border-color);
  transition: width 0.3s ease-in-out;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: var(--layout-shadow-sidebar);
}

.sidebar-bordered {
  border-right: 1px solid var(--layout-border-color);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px 0px 16px;
  transition: opacity 0.3s ease-in-out;
}

.sidebar-title {
  font-family:
    Orbitron,
    Consolas,
    Microsoft YaHei,
    sans-serif;
  font-size: 20px;
  padding: 0 0 16px;
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-shadow: var(--shadow-sidebar-title);
  font-weight: 700;
  border-bottom: 1px solid var(--layout-border-subtle);
  color: var(--layout-text-color);
  transition:
    color 0.3s ease,
    text-shadow 0.3s ease,
    border-color 0.3s ease;
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
}

.menu-category {
  margin-bottom: 8px;
}

.category-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--layout-text-color-secondary);
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
  background: var(--layout-background-color);
  border: 1px solid var(--layout-border-color);
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
  border-color: var(--layout-primary-color);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  transform: translateY(-1px);
}

.menu-item-active {
  border-color: var(--layout-primary-color);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
}

.menu-item-active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--layout-primary-color);
}

.sidebar-collapsed .menu-item-active::before {
  width: 3px;
  height: 100%;
  right: auto;
}

.menu-item-image {
  width: 100%;
  height: 100px;
  background: var(--layout-background-color);
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
  color: var(--layout-text-color-secondary);
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
  color: var(--layout-text-color);
  line-height: 1.4;
  margin-bottom: 4px;
}

.menu-item-description {
  font-size: 12px;
  color: var(--layout-text-color-secondary);
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
  background: var(--layout-background-color);
  border: 1px solid var(--layout-border-color);
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
  color: var(--layout-text-color);
}

.trigger-icon svg {
  display: block;
  margin: 0;
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
  background: var(--layout-border-color);
  border-radius: 2px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: var(--layout-text-color-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 1000;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    width: 280px !important;
  }

  .layout-sidebar.sidebar-mobile-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }

  .sidebar-trigger {
    display: none;
  }

  .sidebar-collapsed .sidebar-content {
    padding: 16px;
  }

  .sidebar-collapsed .sidebar-title {
    opacity: 1;
  }

  .sidebar-collapsed .category-title {
    opacity: 1;
    height: auto;
  }

  .sidebar-collapsed .menu-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .sidebar-collapsed .menu-item-card {
    flex-direction: column;
    height: auto;
  }

  .sidebar-collapsed .menu-item-image {
    width: 100%;
    height: 100px;
    margin: 0;
  }

  .sidebar-collapsed .menu-item-content {
    display: block;
    padding: 12px;
  }

  .sidebar-collapsed .menu-item-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
</style>

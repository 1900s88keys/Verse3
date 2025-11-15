<template>
  <header class="layout-header" :class="headerClass">
    <div class="header-left">
      <slot name="left">
        <button v-if="showToggle" class="sidebar-toggle" @click="handleToggle">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
        <div v-if="title" class="header-title">{{ title }}</div>
      </slot>
    </div>

    <div class="header-center">
      <slot name="center"></slot>
    </div>

    <div class="header-right">
      <slot name="right">
        <div v-if="showUser" class="user-info">
          <div class="user-avatar">{{ userInitial }}</div>
          <span class="user-name">{{ userName }}</span>
        </div>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { HeaderProps } from '../type/types'

const props = withDefaults(defineProps<HeaderProps>(), {
  title: '',
  showToggle: true,
  showUser: true,
  userName: 'User',
  height: 64,
  bordered: true,
  fixed: false,
})

const emit = defineEmits<{
  toggle: []
}>()

const headerClass = computed(() => ({
  'header-bordered': props.bordered,
  'header-fixed': props.fixed,
}))

const userInitial = computed(() => {
  return props.userName.charAt(0).toUpperCase()
})

const handleToggle = () => {
  emit('toggle')
}
</script>

<style scoped>
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  position: relative;
  z-index: 100;
}

.header-bordered {
  border-bottom: 1px solid #e8e8e8;
}

.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-left,
.header-center,
.header-right {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-center {
  justify-content: center;
}

.header-right {
  justify-content: flex-end;
}

.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  margin-right: 16px;
}

.sidebar-toggle:hover {
  background-color: #f5f5f5;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .layout-header {
    padding: 0 16px;
  }

  .header-center {
    display: none;
  }

  .user-name {
    display: none;
  }
}
</style>

<template>
  <main class="layout-content" :class="contentClass">
    <div v-if="loading" class="content-loading">
      <div class="loading-spinner"></div>
      <div class="loading-text">{{ loadingText }}</div>
    </div>

    <div v-else-if="hasError" class="content-error">
      <div class="error-icon">⚠️</div>
      <div class="error-title">{{ errorTitle }}</div>
      <div class="error-description">{{ errorDescription }}</div>
      <button v-if="showRetry" class="retry-button" @click="handleRetry">
        {{ retryText }}
      </button>
    </div>

    <div v-else class="content-wrapper">
      <slot></slot>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ContentProps } from '../type/types'

const props = withDefaults(defineProps<ContentProps>(), {
  loading: false,
  loadingText: '加载中...',
  hasError: false,
  errorTitle: '出错了',
  errorDescription: '抱歉，页面加载失败',
  showRetry: true,
  retryText: '重试',
})

const emit = defineEmits<{
  retry: []
}>()

const contentClass = computed(() => ({
  'content-loading': props.loading,
  'content-has-error': props.hasError,
}))

const handleRetry = () => {
  emit('retry')
}
</script>

<style scoped>
.layout-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  position: relative;
  overflow-y: auto;
}

.content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-loading,
.content-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: #666;
  font-size: 14px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.error-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  text-align: center;
  max-width: 400px;
}

.retry-button {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background: #40a9ff;
}

.retry-button:active {
  background: #096dd9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .layout-content {
    padding: 16px;
  }
}

/* 内容区域滚动条样式 */
.layout-content::-webkit-scrollbar {
  width: 6px;
}

.layout-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.layout-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.layout-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>

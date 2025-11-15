<template>
  <footer class="layout-footer" :class="footerClass" :style="footerStyle">
    <div class="footer-content">
      <div class="footer-left">
        <slot name="left">
          <div class="copyright">© {{ currentYear }} {{ companyName }}</div>
        </slot>
      </div>

      <div class="footer-center">
        <slot name="center">
          <div class="footer-links">
            <a
              v-for="link in links"
              :key="link.key"
              :href="link.url"
              class="footer-link"
              :target="link.target || '_blank'"
            >
              {{ link.label }}
            </a>
          </div>
        </slot>
      </div>

      <div class="footer-right">
        <slot name="right">
          <div class="footer-info">
            {{ version }}
          </div>
        </slot>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FooterProps } from '../type/types'

const props = withDefaults(defineProps<FooterProps>(), {
  companyName: 'Verse3',
  version: 'v1.0.0',
  height: 64,
  bordered: true,
  fixed: false,
  links: () => [
    { key: 'docs', label: '文档', url: '#' },
    { key: 'help', label: '帮助', url: '#' },
    { key: 'privacy', label: '隐私', url: '#' },
  ],
  backgroundColor: '#fff',
  textColor: '#666',
})

const currentYear = computed(() => new Date().getFullYear())

const footerClass = computed(() => ({
  'footer-bordered': props.bordered,
  'footer-fixed': props.fixed,
}))

const footerStyle = computed(() => ({
  height: `${props.height}px`,
  backgroundColor: props.backgroundColor,
  color: props.textColor,
}))
</script>

<style scoped>
.layout-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  position: relative;
  z-index: 100;
}

.footer-bordered {
  border-top: 1px solid #e8e8e8;
}

.footer-fixed {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1200px;
  padding: 0 24px;
}

.footer-left,
.footer-center,
.footer-right {
  display: flex;
  align-items: center;
  flex: 1;
}

.footer-center {
  justify-content: center;
}

.footer-right {
  justify-content: flex-end;
}

.copyright {
  font-size: 14px;
  color: inherit;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-link {
  font-size: 14px;
  color: inherit;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #1890ff;
}

.footer-info {
  font-size: 14px;
  color: inherit;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-content {
    padding: 0 16px;
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }

  .footer-left,
  .footer-center,
  .footer-right {
    flex: none;
    justify-content: center;
  }

  .footer-links {
    gap: 16px;
  }

  .footer-link {
    font-size: 12px;
  }

  .copyright,
  .footer-info {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .footer-links {
    flex-direction: column;
    gap: 8px;
  }
}
</style>

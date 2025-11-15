<template>
  <div class="layout-demo">
    <div class="demo-section">
      <h2>布局组件演示</h2>
      <p>这个页面展示了 Layout 组件的各种配置和功能</p>
    </div>

    <div class="demo-controls">
      <div class="control-group">
        <label>
          <input 
            type="checkbox" 
            v-model="showHeader" 
            @change="updateLayout"
          >
          显示顶部导航
        </label>
        <label>
          <input 
            type="checkbox" 
            v-model="showSidebar" 
            @change="updateLayout"
          >
          显示侧边栏
        </label>
        <label>
          <input 
            type="checkbox" 
            v-model="showFooter" 
            @change="updateLayout"
          >
          显示底部
        </label>
      </div>
      
      <div class="control-group">
        <label>
          侧边栏状态：
          <select v-model="sidebarCollapsed" @change="updateLayout">
            <option :value="false">展开</option>
            <option :value="true">折叠</option>
          </select>
        </label>
      </div>
    </div>

    <div class="demo-content">
      <div class="content-card">
        <h3>功能特性</h3>
        <ul>
          <li>✅ 响应式设计 - 适配各种屏幕尺寸</li>
          <li>✅ 可折叠侧边栏 - 节省空间</li>
          <li>✅ 灵活的插槽系统 - 自定义内容</li>
          <li>✅ 主题定制 - 支持多种配色方案</li>
          <li>✅ TypeScript 支持 - 完整的类型定义</li>
          <li>✅ 无障碍访问 - 遵循 ARIA 标准</li>
        </ul>
      </div>

      <div class="content-card">
        <h3>组件结构</h3>
        <div class="component-tree">
          <div class="tree-node">Layout</div>
          <div class="tree-children">
            <div class="tree-node">├── LayoutHeader</div>
            <div class="tree-node">├── LayoutSidebar</div>
            <div class="tree-node">├── LayoutContent</div>
            <div class="tree-node">└── LayoutFooter</div>
          </div>
        </div>
      </div>

      <div class="content-card">
        <h3>快速操作</h3>
        <div class="action-buttons">
          <button @click="toggleSidebar" class="demo-btn">
            切换侧边栏
          </button>
          <button @click="showNotification" class="demo-btn">
            显示通知
          </button>
          <button @click="changeTheme" class="demo-btn">
            切换主题
          </button>
        </div>
      </div>

      <div class="content-card">
        <h3>状态信息</h3>
        <div class="status-grid">
          <div class="status-item">
            <span class="status-label">顶部导航:</span>
            <span class="status-value" :class="{ active: showHeader }">
              {{ showHeader ? '显示' : '隐藏' }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">侧边栏:</span>
            <span class="status-value" :class="{ active: showSidebar }">
              {{ showSidebar ? '显示' : '隐藏' }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">底部:</span>
            <span class="status-value" :class="{ active: showFooter }">
              {{ showFooter ? '显示' : '隐藏' }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">侧边栏状态:</span>
            <span class="status-value">
              {{ sidebarCollapsed ? '折叠' : '展开' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 布局配置
const showHeader = ref(true)
const showSidebar = ref(true)
const showFooter = ref(true)
const sidebarCollapsed = ref(false)

// 当前主题
const currentTheme = ref<'light' | 'dark'>('light')

// 更新布局配置
const updateLayout = () => {
  console.log('Layout updated:', {
    showHeader: showHeader.value,
    showSidebar: showSidebar.value,
    showFooter: showFooter.value,
    sidebarCollapsed: sidebarCollapsed.value
  })
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
  updateLayout()
}

// 显示通知
const showNotification = () => {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification('布局演示', {
        body: '这是一个演示通知！',
        icon: '/favicon.ico'
      })
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          showNotification()
        }
      })
    }
  } else {
    alert('这是一个演示通知！')
  }
}

// 切换主题
const changeTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
  
  // 应用主题到根元素
  const root = document.documentElement
  if (currentTheme.value === 'dark') {
    root.style.setProperty('--layout-primary-color', '#1890ff')
    root.style.setProperty('--layout-background-color', '#141414')
    root.style.setProperty('--layout-text-color', '#ffffff')
  } else {
    root.style.setProperty('--layout-primary-color', '#1890ff')
    root.style.setProperty('--layout-background-color', '#f5f5f5')
    root.style.setProperty('--layout-text-color', '#333333')
  }
  
  console.log('Theme changed to:', currentTheme.value)
}

// 请求通知权限
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission()
}
</script>

<style scoped>
.layout-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-section {
  text-align: center;
  margin-bottom: 32px;
}

.demo-section h2 {
  color: #1890ff;
  margin-bottom: 8px;
  font-size: 28px;
}

.demo-section p {
  color: #666;
  font-size: 16px;
}

.demo-controls {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 32px;
  border: 1px solid #e8e8e8;
}

.control-group {
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #333;
}

.control-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.control-group select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
}

.demo-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.content-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;
}

.content-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.content-card h3 {
  color: #1890ff;
  margin-bottom: 16px;
  font-size: 18px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 8px;
}

.content-card ul {
  list-style: none;
  padding: 0;
}

.content-card li {
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
  color: #333;
}

.content-card li:last-child {
  border-bottom: none;
}

.component-tree {
  font-family: 'Courier New', monospace;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.tree-node {
  color: #333;
  margin: 4px 0;
}

.tree-children {
  margin-left: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.demo-btn {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 14px;
}

.demo-btn:hover {
  background: #40a9ff;
}

.demo-btn:active {
  background: #096dd9;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
}

.status-label {
  color: #666;
  font-weight: 500;
}

.status-value {
  color: #333;
  font-weight: bold;
}

.status-value.active {
  color: #52c41a;
}

@media (max-width: 768px) {
  .layout-demo {
    padding: 16px;
  }
  
  .control-group {
    flex-direction: column;
    gap: 12px;
  }
  
  .demo-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
}
</style>
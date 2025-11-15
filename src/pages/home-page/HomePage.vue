<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { title: '总用户数', value: '1,234', change: '+12.5%' },
  { title: '活跃项目', value: '56', change: '+8.2%' },
  { title: '完成率', value: '89.3%', change: '+2.1%' },
  { title: '响应时间', value: '1.2s', change: '-15.3%' }
])

const recentActivities = ref([
  { id: 1, user: '张三', action: '更新了项目配置', time: '2分钟前' },
  { id: 2, user: '李四', action: '完成了代码审查', time: '5分钟前' },
  { id: 3, user: '王五', action: '创建了新的任务', time: '10分钟前' },
  { id: 4, user: '赵六', action: '提交了代码', time: '15分钟前' }
])
</script>

<template>
  <div class="home-page">
    <div class="page-header">
      <h1>欢迎回来</h1>
      <p>这是您的项目概览页面</p>
    </div>

    <div class="stats-grid">
      <div 
        v-for="stat in stats" 
        :key="stat.title"
        class="stat-card"
      >
        <div class="stat-title">{{ stat.title }}</div>
        <div class="stat-value">{{ stat.value }}</div>
        <div class="stat-change" :class="{ 'positive': stat.change.startsWith('+'), 'negative': stat.change.startsWith('-') }">
          {{ stat.change }}
        </div>
      </div>
    </div>

    <div class="content-sections">
      <section class="activity-section">
        <h2>最近活动</h2>
        <div class="activity-list">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-info">
              <div class="activity-user">{{ activity.user }}</div>
              <div class="activity-action">{{ activity.action }}</div>
            </div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
        </div>
      </section>

      <section class="quick-actions">
        <h2>快速操作</h2>
        <div class="action-buttons">
          <button class="action-button primary">创建新项目</button>
          <button class="action-button">导入数据</button>
          <button class="action-button">查看报告</button>
          <button class="action-button">系统设置</button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: #52c41a;
}

.stat-change.negative {
  color: #ff4d4f;
}

.content-sections {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.activity-section,
.quick-actions {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activity-section h2,
.quick-actions h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-info {
  flex: 1;
}

.activity-user {
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.activity-action {
  font-size: 14px;
  color: #666;
}

.activity-time {
  font-size: 12px;
  color: #999;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  padding: 12px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  text-align: left;
}

.action-button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.action-button.primary {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.action-button.primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

@media (max-width: 768px) {
  .home-page {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .content-sections {
    grid-template-columns: 1fr;
  }
}
</style>

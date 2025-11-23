import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home-page/HomePage.vue'),
      meta: {
        title: '首页',
      },
    },
    {
      path: '/global',
      name: 'global',
      component: () => import('@/pages/global-page/GlobalPage.vue'),
      meta: {
        title: '地球',
      },
    },
  ],
});

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = `${to.meta.title} - Verse3`;
  }
  next();
});

export default router;

import { createRouter, createWebHistory } from "vue-router";

import Home from "@/pages/home-page/HomePage.vue";
import LayoutDemo from "@/pages/layout-demo/LayoutDemo.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: "首页",
      },
    },
    {
      path: "/demo",
      name: "demo",
      component: LayoutDemo,
      meta: {
        title: "布局演示",
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

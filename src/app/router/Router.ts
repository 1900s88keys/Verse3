import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/pages/home-page/HomePage.vue"),
      meta: {
        title: "首页",
      },
    },
    {
      path: "/demo",
      name: "demo",
      component: () => import("@/pages/layout-demo/LayoutDemo.vue"),
      meta: {
        title: "布局演示",
      },
    },
    {
      path: "/reflection",
      name: "reflection",
      component: () => import("@/pages/reflection-page/ReflectionPage.vue"),
      meta: {
        title: "反射演示",
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

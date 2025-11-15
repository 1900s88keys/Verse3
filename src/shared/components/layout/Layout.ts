import type { App } from "vue";
import Layout from "./src/AppLayout.vue";
import LayoutHeader from "./src/LayoutHeader.vue";
import LayoutSidebar from "./src/LayoutSidebar.vue";
import LayoutContent from "./src/LayoutContent.vue";
import LayoutFooter from "./src/LayoutFooter.vue";

// 导入统一样式
import "./style/index.css";
import type { LayoutPreset, ResponsiveInfo } from "./type/types";

// 导入统一类型定义
export type {
  MenuItem,
  LayoutProps,
  HeaderProps,
  SidebarProps,
  ContentProps,
  FooterProps,
  ResponsiveInfo,
  LayoutPreset,
  ThemeType,
} from "./type/types";

// 组件导出
export { Layout, LayoutHeader, LayoutSidebar, LayoutContent, LayoutFooter };

// 默认导出主组件
export default Layout;

// Vue 插件安装函数
export const installLayout = (app: App) => {
  app.component("AppLayout", Layout);
  app.component("LayoutHeader", LayoutHeader);
  app.component("LayoutSidebar", LayoutSidebar);
  app.component("LayoutContent", LayoutContent);
  app.component("LayoutFooter", LayoutFooter);
};

// 全局安装方法
Layout.install = installLayout;

// 版本信息
export const version = "1.0.0";

// 主题相关工具函数
export const setLayoutTheme = (theme: "light" | "dark" | "compact") => {
  const body = document.body;

  // 移除所有主题类
  body.classList.remove("layout-theme-dark", "layout-theme-compact");

  // 添加新主题类
  if (theme === "dark") {
    body.classList.add("layout-theme-dark");
  } else if (theme === "compact") {
    body.classList.add("layout-theme-compact");
  }
};

// 响应式工具函数
export const useResponsive = (): ResponsiveInfo => {
  const isMobile = window.innerWidth <= 768;
  const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
  const isDesktop = window.innerWidth > 1024;

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};

// 布局预设配置
export const layoutPresets: Record<string, LayoutPreset> = {
  // 管理后台布局
  admin: {
    sidebarCollapsed: false,
    layoutDirection: "vertical",
  },

  // 门户网站布局
  portal: {
    sidebarCollapsed: false,
    layoutDirection: "vertical",
  },

  // 移动端布局
  mobile: {
    sidebarCollapsed: true,
    layoutDirection: "vertical",
  },
};

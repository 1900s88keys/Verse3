import type { Component } from "vue";

// 菜单项类型定义
export interface MenuItem {
  key: string;
  label: string;
  icon?: string | Component;
  disabled?: boolean;
  category?: string;
  description?: string;
  image?: string;
  children?: MenuItem[];
}

// 布局组件属性类型定义
export interface LayoutProps {
  sidebarCollapsed?: boolean;
  layoutDirection?: "horizontal" | "vertical";
}

// 头部组件属性类型定义
export interface HeaderProps {
  title?: string;
  showToggle?: boolean;
  showUser?: boolean;
  userName?: string;
  height?: number;
  bordered?: boolean;
  fixed?: boolean;
}

// 侧边栏组件属性类型定义
export interface SidebarProps {
  collapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  collapsible?: boolean;
  bordered?: boolean;
  menuItems?: MenuItem[];
  activeKey?: string;
  title?: string;
}

// 内容区域组件属性类型定义
export interface ContentProps {
  loading?: boolean;
  loadingText?: string;
  hasError?: boolean;
  errorTitle?: string;
  errorDescription?: string;
  showRetry?: boolean;
  retryText?: string;
}

// 底部组件属性类型定义
export interface FooterProps {
  companyName?: string;
  version?: string;
  height?: number;
  bordered?: boolean;
  fixed?: boolean;
  links?: Array<{
    key: string;
    label: string;
    url: string;
    target?: string;
  }>;
  backgroundColor?: string;
  textColor?: string;
}

// 响应式工具函数返回类型
export interface ResponsiveInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

// 布局预设类型
export interface LayoutPreset {
  sidebarCollapsed: boolean;
  layoutDirection: "horizontal" | "vertical";
}

// 主题类型
export type ThemeType = "light" | "dark" | "compact";

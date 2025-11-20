import { reactive } from 'vue';

import router from '@/app/router/Router';
import type { MenuItem } from '@/shared/components/layout/Layout';

const threeJsMenuItems: MenuItem[] = [
  {
    key: '/',
    label: '首页',
    category: 'Three.js',
    description: '应用首页和概览',
    image: '/images/home.svg',
  },
  {
    key: '/global',
    label: '地球',
    category: 'Three.js',
    description: '地球',
    image: '/images/global.svg',
  },
];

const webGpuMenuItems: MenuItem[] = [];

export class Menus {
  private state = reactive({
    activeMenuKey: '/',
    sidebarCollapsed: false,
    menuItems: [...threeJsMenuItems, ...webGpuMenuItems] as MenuItem[],
  });

  get activeMenuKey() {
    return this.state.activeMenuKey;
  }

  get menuItems() {
    return this.state.menuItems;
  }

  get sidebarCollapsed() {
    return this.state.sidebarCollapsed;
  }

  // 处理菜单点击事件
  handleMenuClick = (item: MenuItem) => {
    if (item.disabled) return;

    // 更新活动菜单项
    this.state.activeMenuKey = item.key;

    // 使用导入的 router 实例进行路由跳转
    router.push(item.key);
  };

  onCollapseChange = (collapsed: boolean) => {
    this.state.sidebarCollapsed = collapsed;
  };

  changeActiveMenuKey = (key: string) => {
    const matchedItem = this.menuItems.find((item) => item.key === key);
    if (matchedItem) {
      this.state.activeMenuKey = matchedItem.key;
    }
  };
}

export const menus = new Menus();

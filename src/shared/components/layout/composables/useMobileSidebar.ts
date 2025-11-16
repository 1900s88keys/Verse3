import { ref, onMounted, onUnmounted } from "vue";

export interface MobileSidebarState {
  isMobile: boolean;
  mobileSidebarOpen: boolean;
}

export function useMobileSidebar() {
  const isMobile = ref(false);
  const mobileSidebarOpen = ref(false);

  // 检测是否为移动端
  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768;
    // 在移动端时，默认关闭侧边栏
    if (isMobile.value) {
      mobileSidebarOpen.value = false;
    }
  };

  // 监听窗口大小变化
  const handleResize = () => {
    checkMobile();
  };

  // 处理移动端侧边栏切换
  const toggleMobileSidebar = () => {
    mobileSidebarOpen.value = !mobileSidebarOpen.value;
  };

  // 关闭移动端侧边栏
  const closeMobileSidebar = () => {
    mobileSidebarOpen.value = false;
  };

  // 打开移动端侧边栏
  const openMobileSidebar = () => {
    if (isMobile.value) {
      mobileSidebarOpen.value = true;
    }
  };

  onMounted(() => {
    checkMobile();
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });

  return {
    isMobile,
    mobileSidebarOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
    openMobileSidebar,
  };
}

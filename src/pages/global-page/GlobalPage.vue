<template>
  <div ref="containerRef" class="container"></div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

import { sceneSetting } from '@/features/three-application/setting/Setting';
import { ThreeApplication } from '@/features/three-application/ThreeApplication';
import { Earth } from '@/pages/global-page/earth/Earth';

sceneSetting.bgColor = '#262f4c';

const threeApplication = new ThreeApplication();
const earth = new Earth({
  sizes: threeApplication.sizes,
  ticker: threeApplication.ticker,
  pane: threeApplication.pane,
});

console.log(earth.container);

const containerRef = ref<HTMLDivElement>();

onMounted(async () => {
  await nextTick();
  if (!containerRef.value) {
    return;
  }
  threeApplication.init(containerRef.value);
  threeApplication.scene.instance.add(earth.container);
});

onUnmounted(() => {
  earth.destroy();
  threeApplication.destroy();
});
</script>
<style scoped>
.container {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>

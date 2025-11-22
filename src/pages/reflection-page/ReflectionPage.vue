<template>
  <div ref="containerRef" class="container"></div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

import { ThreeApplication } from '@/features/three-application/ThreeApplication';
import { Earth } from '@/pages/reflection-page/earth/Earth';

const threeApplication = new ThreeApplication();
const earth = new Earth({
  sizes: threeApplication.sizes,
  ticker: threeApplication.ticker,
  pane: threeApplication.pane,
});

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

<template>
  <div ref="containerRef" class="container"></div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

import { ThreeApplication } from '@/features/three-application/ThreeApplication';

const threeApplication = new ThreeApplication();

const containerRef = ref<HTMLDivElement>();

onMounted(async () => {
  await nextTick();
  if (!containerRef.value) {
    return;
  }
  threeApplication.init(containerRef.value);
});

onUnmounted(() => {
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

<template>

</template>

<script setup lang="ts">
  import { onUnmounted } from "vue";
  import { Earth, Marker } from "@verse3/components";

  interface Props {
    editor: Earth;
    name: string;
    longitude: string;
    latitude: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '北京',
    longitude: 116.404,
    latitude: 39.915
  })

  const marker = new Marker(props.editor, {
    name: props.name,
    longitude: props.longitude,
    latitude: props.latitude,
  });
   
  onUnmounted(() => {
    marker.destroy();
  });
</script>

<style>
</style>
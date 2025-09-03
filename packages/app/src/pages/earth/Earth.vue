<template>
  <Marker :editor="editor" ></Marker>
</template>

<script lang="ts" setup>
import { onUnmounted } from "vue";
import { Earth } from "@verse3/components";
import Marker from "./components/Marker.vue";

const editor = new Earth({
  containerElement: document.body,
});
   
  onUnmounted(() => {
    editor.destroy();
  });
</script>

<style>
</style>
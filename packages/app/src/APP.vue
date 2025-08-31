<template>
</template>

<script setup>
  import { onUnmounted } from "vue";
  import { Editor } from "@verse3/core";
  const editor = new Editor({
    containerElement: document.body,
  });
   
  onUnmounted(() => {
    editor.destroy();
  });
</script>

<style>
  body {
    margin: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    overscroll-behavior-x: none;
  }
</style>
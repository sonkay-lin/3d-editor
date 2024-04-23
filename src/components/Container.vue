<template>
  <div class="container">
    <TopToolBar />
    <LeftPannel />
    <Viewport />
    <RightPannel />
    <BottomBar />
  </div>
</template>

<script setup>
import TopToolBar from './TopToolBar/index.vue';
import LeftPannel from './leftPanel/index.vue'
import Viewport from './Viewport.vue';
import RightPannel from './rightPanel/index.vue'
import BottomBar from './BottomBar/index.vue'
</script>

<style scoped>
.container {
  padding: 0 300px;
  padding-top: 32px;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
  /* background-color: rgb(24, 24, 24); */
}
</style>
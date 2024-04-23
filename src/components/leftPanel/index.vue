<template>
  <div class="left">
    <SenceList />
    <Asset />
    <TransformMode />
  </div>
</template>

<script setup>
import SenceList from './SceneList.vue'
import Asset from './Asset.vue'
import TransformMode from './TransformMode.vue';
</script>

<style scoped>
.left {
  position: absolute;
  width: 300px;
  padding-top: 350px;
  height: calc(100% - 32px);
  box-sizing: border-box;
  top: 32px;
  left: 0;
}
</style>
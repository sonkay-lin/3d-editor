<template>
  <Splitpanes class="left" horizontal>
    <Pane size="30">
      <SenceList />
    </Pane>
    <Pane>
      <Asset />
    </Pane>
  </Splitpanes>
</template>

<script setup>
import SenceList from './SceneList.vue'
import Asset from './Asset.vue'
import { Splitpanes, Pane } from 'splitpanes';
</script>

<style scoped>
.left {
  width: 100%;
  height: 100%;
  min-width: 285px;
}
</style>
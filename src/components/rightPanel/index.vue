<template>
  <div class="right">
    <SideBarNav v-model="active" @activeChange="activeChange"/>
    <Scene v-show="active === 'scene'" />
    <Renderer v-show="active === 'renderer'" />
    <Object3D v-show="active === 'object3d'" />
    <Material v-show="active === 'material'" />
    <Geometry v-show="active === 'geometry'" />
    <HistoryList v-show="otherPanels.includes('history')"/>
  </div>
</template>

<script setup>
import SideBarNav from './SideBarNav.vue'
import Renderer from './Renderer/Renderer.vue'
import Scene from './Scene/Scene.vue'
import Material from './Material/Material.vue'
import Object3D from './Object3D/Object3D.vue';
import Geometry from './Geometry/Geometry.vue';
import HistoryList from './HistoryList.vue';
import { ref } from 'vue'

const active = ref('scene')
const otherPanels = ref([])

const activeChange = (actives) => {
  otherPanels.value = actives
}
</script>

<style scoped>
.right {
  position: absolute;
  width: 300px;
  height: calc(100% - 32px);
  right: 0;
  top: 32px;
  display: flex;
}
</style>
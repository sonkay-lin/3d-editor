<template>
  <Splitpanes class="right">
    <Pane class="nav">
      <SideBarNav v-model="active" @activeChange="activeChange" />
    </Pane>
    <Pane class="content">
      <Splitpanes horizontal>
        <Pane :size="size.top">
          <Scene v-show="active === 'scene'" />
          <Renderer v-show="active === 'renderer'" />
          <Object3D v-show="active === 'object3d'" />
          <Material v-show="active === 'material'" />
          <Geometry v-show="active === 'geometry'" />
        </Pane>
        <Pane :size="size.bottom">
          <HistoryList />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>

<script setup>
import SideBarNav from './SideBarNav.vue';
import Renderer from './Renderer/Renderer.vue';
import Scene from './Scene/Scene.vue';
import Material from './Material/Material.vue';
import Object3D from './Object3D/Object3D.vue';
import Geometry from './Geometry/Geometry.vue';
import HistoryList from './HistoryList.vue';
import { reactive, ref } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';

const active = ref('scene');
const otherPanels = ref([]);
const size = reactive({
  top: 100,
  bottom: 0
});

const activeChange = (actives) => {
  otherPanels.value = actives;
  if (otherPanels.value.includes('history')) {
    size.top = 80
    size.bottom = 20
  } else {
    size.top = 100
    size.bottom = 0
  }
};

</script>

<style scoped lang="scss">
.right {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 255px;
  .nav {
    width: 40px !important;
  }
  .nav + :deep(.splitpanes__splitter) {
    display: none;
  }
  .content {
    width: calc(100% - 40px) !important;
  }
}
</style>

<template>
  <div class="bottom">
    <Viewpoint v-model="currentViewPoint" @change="change" />
    <ICon
      :class="setClass(item.id)"
      v-for="item in IconList"
      :content="item.content"
      :code="item.code"
      :key="item.id"
      @click="item.handle()"
    ></ICon>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import Viewpoint from './Viewpoint.vue';
import { currentViewPoint, defaultCamera, viewpoints, customerCamera } from './useViewpoint';
import { globalConfig } from '@/hooks/useConfig';
import { getEditor } from '@/hooks/useEditor';
const GRID = 'grid'
const AXIS = 'axis'
const IconList = [
  {
    id: GRID,
    code: 'icon-24gl-grid',
    content: '网格',
    handle: () => {
      globalConfig.isShowGrid = !globalConfig.isShowGrid;
      if (globalConfig.isShowGrid) {
        activeTool.value.push(GRID);
      } else {
        activeTool.value = activeTool.value.filter((item) => item !== GRID);
      }
      getEditor().dispatch.sceneGraphChanged();
    }
  },
  {
    id: AXIS,
    code: 'icon-sanweizuobiao',
    content: '坐标轴',
    handle: () => {
      globalConfig.isShowAxis = !globalConfig.isShowAxis;
      if (globalConfig.isShowAxis) {
        activeTool.value.push(AXIS);
      } else {
        activeTool.value = activeTool.value.filter((item) => item !== AXIS);
      }
      getEditor().dispatch.sceneGraphChanged();
    }
  }
];
const activeTool = ref([]);
const setClass = (key) => {
  if (activeTool.value.includes(key)) {
    return 'toolIcon active'
  }
  return 'toolIcon'
}

const allViewpoints = computed(() => [...defaultCamera, ...viewpoints, ...customerCamera]);
const change = (value) => {
  const view = allViewpoints.value.find((item) => item.value === value);
  view?.handle();
};

onMounted(() => {
  if (globalConfig.isShowGrid) {
    activeTool.value.push(GRID)
  }
  if (globalConfig.isShowAxis) {
    activeTool.value.push(AXIS)
  }
})
</script>

<style scoped lang="scss">
.bottom {
  position: absolute;
  left: 302px;
  /* width: 500px; */
  bottom: 0;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  :deep(.toolIcon) {
    width: 24px;
    height: 24px;
    background-color: var(--el-bg-color);
    cursor: pointer;
    margin: 0 1px;
    &.active {
      background-color: var(--el-color-primary);
    }
  }
}
</style>

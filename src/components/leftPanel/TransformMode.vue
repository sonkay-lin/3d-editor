<template>
  <div class="mode-bar">
    <ICon
      :class="setActive(controlsMode.translate)"
      content="移动"
      placement="right"
      @click="setMode(controlsMode.translate)"
    >
      <TopRight />
    </ICon>
    <ICon
      :class="setActive(controlsMode.rotate)"
      content="旋转"
      placement="right"
      @click="setMode(controlsMode.rotate)"
    >
      <Refresh />
    </ICon>
    <ICon :class="setActive(controlsMode.scale)" content="缩放" placement="right" @click="setMode(controlsMode.scale)">
      <Rank />
    </ICon>
    <ICon
      v-if="globalConfig.transform.space === 'world'"
      class="tool-item"
      content="世界坐标"
      code="icon-shijiezuobiao"
      placement="right"
      @click="setSpace('local')"
    ></ICon>
    <ICon
      v-if="globalConfig.transform.space === 'local'"
      class="tool-item"
      content="本地坐标"
      code="icon-bendizuobiao"
      placement="right"
      @click="setSpace('world')"
    ></ICon>
  </div>
  <div class="axis-bar">
    <ICon :class="setAxisClass('X')" content="X轴" code="icon-xalxe" placement="right" @click="setAxis('X')"></ICon>
    <ICon :class="setAxisClass('Z')" content="Z轴" code="icon-zaxle" placement="right" @click="setAxis('Z')"></ICon>
    <ICon :class="setAxisClass('Y')" content="Y轴" code="icon-yaxis" placement="right" @click="setAxis('Y')"></ICon>
  </div>

  <!-- <div class="tool-bar">
    <ICon :class="setAxisClass('Y')" content="Y轴" code="icon-qiege" placement="right"></ICon>
  </div> -->
</template>

<script setup>
import { Rank, Refresh, TopRight } from '@element-plus/icons-vue';
import { onMounted, ref, nextTick, reactive } from 'vue';
import { getViewport } from '@/hooks/useViewport';
import { globalConfig } from '@/hooks/useConfig';
import * as THREE from 'three';
import { getEditor } from '@/hooks/useEditor';

let transformControls = null;

const controlsMode = {
  translate: 'translate',
  rotate: 'rotate',
  scale: 'scale'
};

const setActive = (mode) => {
  if (globalConfig.transform.mode === mode) {
    return 'active';
  }
  return '';
};
// 设置控制器变换模式
const setMode = (mode) => {
  globalConfig.transform.mode = mode;
  transformControls.setMode(mode);
};
// 设置空间变换
const setSpace = (mode) => {
  transformControls.setSpace(mode);
  globalConfig.transform.space = mode;
};
// 设置坐标轴
const setAxis = (direct) => {
  transformControls[`show${direct}`] = !transformControls[`show${direct}`];
  globalConfig.transform[`show${direct}`] = transformControls[`show${direct}`];
};

const setAxisClass = (direct) => {
  if (globalConfig.transform[`show${direct}`]) {
    return 'active';
  }
  return '';
};

// const clipping = () => {
//   const planes = [
//     new THREE.Plane(new THREE.Vector3(-1, 0, 0), 1),
//     new THREE.Plane(new THREE.Vector3(0, -1, 0), 1),
//     new THREE.Plane(new THREE.Vector3(0, 0, -1), 1),
//     new THREE.Plane(new THREE.Vector3(1, 0, 0), 1),
//     new THREE.Plane(new THREE.Vector3(0, 1, 0), 1),
//     new THREE.Plane(new THREE.Vector3(0, 0, 1), 1),
//   ];
//   const PlaneHelpers = planes.map((p) => new THREE.PlaneHelper(p, 2, 0xffffff));
//   const group = new THREE.Group()
//   PlaneHelpers.forEach((p) => group.add(p));
//   getEditor().scene.add(group)
// };

onMounted(() => {
  setTimeout(() => {
    const viewport = getViewport();
    transformControls = viewport.transformControls;
    transformControls.setMode(globalConfig.transform.mode);
    transformControls.setSpace(globalConfig.transform.space);
    transformControls.showX = globalConfig.transform.showX;
    transformControls.showY = globalConfig.transform.showY;
    transformControls.showZ = globalConfig.transform.showZ;

    // clipping();
  });
});
</script>

<style scoped lang="scss">
.mode-bar,
.axis-bar,
.tool-bar {
  position: absolute;
  width: 30px;
  height: 120px;
  background-color: #fff;
  left: 308px;
  top: 8px;
  z-index: 100;
}
.axis-bar {
  height: 90px;
  top: 136px;
}
.tool-bar {
  top: 234px;
  height: 90px;
}
:deep(.el-icon) {
  padding: 7px;
  cursor: pointer;
  color: #606060;
  &:hover {
    background-color: rgba(64, 158, 255, 0.1);
  }
  &.active {
    background-color: rgba(64, 158, 255, 0.3);
  }
}
</style>

<template>
  <span class="label">切换视角：</span>
  <el-select class="viewpoint" v-bind="$attrs" v-on="$attrs" size="small">
    <el-option-group v-for="item in camerasList" :key="item.key">
      <!-- <el-option v-for="item in viewpointList" :label="item.label" :value="item.value" :key="item.id"></el-option> -->
      <el-option v-for="view in item.options" :label="view.label" :value="view.value" :key="view.value"></el-option>
    </el-option-group>
  </el-select>
</template>

<script setup>
import { getEditor } from '@/hooks/useEditor';
import { getViewport } from '@/hooks/useViewport';
import { ref, onMounted, toRaw } from 'vue';
import { defaultCamera, viewpoints, customerCamera } from './useViewpoint';

let editor;
const camerasList = ref([]);

onMounted(() => {
  editor = getEditor();
  // 如果相机物体名字被修改,更新select label名字
  editor.onEvent.refreshObjectUI((object, attrs) => {
    // TODO: attrs is undefined
    if (!object.isCamera) return
    for(let i = 0; i < customerCamera.length; i++) {
      const item = customerCamera[i]
      const camera = editor.cameras[item.value]
      if (camera === object) {
        item.label = object.name
        break
      }
    }
  })
  editor.onEvent.cameraAdded((camera) => {
    customerCamera.push({
      value: camera.uuid,
      label: camera.name,
      handle: () => {
        editor.setViewportCamera(camera.uuid);
      }
    });
  });
  editor.onEvent.cameraRemoved((camera) => {
    const index = customerCamera.findIndex((item) => item.value === camera.uuid);
    index > -1 && customerCamera.splice(index, 1);
  });
  // 添加默认相机，视图，用户相机
  camerasList.value.push({
    key: 0,
    options: defaultCamera
  });
  camerasList.value.push({
    key: 1,
    options: viewpoints
  });
  camerasList.value.push({
    key: 2,
    options: customerCamera
  });
});
</script>

<style scoped lang="scss">
.label {
  font-size: 14px;
  color: #fff;
}
.viewpoint {
  width: 100px;
  background-color: var(--el-bg-color);
}
</style>

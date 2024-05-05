<template>
  <div class="center">
    <BottomBar />
    <TransformMode />
    <div class="viewport" id="viewport"></div>
  </div>
</template>

<script setup>
import viewport from '@/utils/Viewport';
import { nextTick, onMounted } from 'vue';
import { initEditor } from '@/hooks/useEditor';
import { globalConfig, initConfig } from '@/hooks/useConfig';
import BottomBar from './BottomBar/index.vue';
import TransformMode from './TransformMode.vue';

initConfig();
// TODO: 这里 editor.fromJSON 是异步加载的，后面改用异步组件
const editor = initEditor();

onMounted(() => {
  let v = new viewport(editor);
  const { renderer: option } = globalConfig;
  // 等viewport中dom加载完将渲染器挂载
  editor.createRenderer(option);
  // 页面加载完自动调用一次
  editor.event.windowResize.dispatch();
  // nextTick(() => {
  // })
});
</script>

<style scoped lang="scss">
.center {
  position: relative;
  width: 100%;
  height: 100%;
}
.viewport {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
}
</style>

<template>
  <div class="viewport" id="viewport"></div>
</template>

<script setup>
import viewport from '@/utils/Viewport';
import { nextTick, onMounted } from 'vue';
import { initEditor } from '@/hooks/useEditor';
import { globalConfig, initConfig } from '@/hooks/useConfig';

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

<style scoped>
.viewport {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>

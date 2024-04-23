<template>
  <div class="viewport" id="viewport"></div>
</template>

<script setup>
import viewport from '@/utils/Viewport'
import { nextTick, onMounted } from 'vue';
import { initEditor } from '@/hooks/useEditor'
import { globalConfig, initConfig } from '@/hooks/useConfig';

const editor = initEditor()

onMounted(() => {
  initConfig()
  let v = new viewport(editor)
  nextTick(() => {
    const { renderer: option } = globalConfig
    // 等viewport中dom加载完将渲染器挂载
    editor.createRenderer(option)
    // 页面加载完自动调用一次
    editor.dispatch.windowResize()
  })
})
</script>

<style scoped>
.viewport {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
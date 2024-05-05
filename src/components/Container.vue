<template>
  <div class="container">
    <TopToolBar />
    <Splitpanes class="default-theme" vertical @resize="resize">
      <Pane :size="size.left">
        <LeftPannel />
      </Pane>
      <Pane :size="size.center">
        <Viewport />
      </Pane>
      <Pane :size="size.right">
        <RightPannel />
      </Pane>
    </Splitpanes>
  </div>
</template>

<script setup>
import TopToolBar from './TopToolBar/index.vue';
import LeftPannel from './leftPanel/index.vue';
import Viewport from './centerPanel/Viewport.vue';
import RightPannel from './rightPanel/index.vue';
import { Splitpanes, Pane } from 'splitpanes';
import { getEditor } from '@/hooks/useEditor';
import { nextTick, onMounted, reactive, ref } from 'vue';

const size = reactive({
  left: 22,
  right: 20,
  center: 58
});

const resize = () => {
  const editor = getEditor();
  editor.event.windowResize.dispatch();
};
onMounted(() => {
  const { innerWidth } = window;
  console.log(innerWidth);
  if (innerWidth >= 1366) {
    console.log(1366);
    size.left = 21.2;
    size.right = 20;
    size.center = 100 - size.left - size.right;
  }
  if (innerWidth >= 1920) {
    console.log(1920);
    size.left = 15.8;
    size.right = 15.5;
    size.center = 100 - size.left - size.right;
  }
  setTimeout(() => {
    resize();
  }, 300);
});
</script>

<style scoped>
.default-theme {
  width: 100vw;
  height: calc(100vh - 32px);
}
.container {
  padding-top: 32px;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}
</style>

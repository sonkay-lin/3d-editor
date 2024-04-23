<template>
  <div class="tool-bar">
    <div>
      <File />
      <!-- <el-button type="primary" size="small">编辑</el-button> -->
    </div>
    <div class="bar-center">
      <ICon content="撤销(ctrl+z)" @click="command('undo')"><RefreshLeft /></ICon>
      <ICon content="撤销(ctrl+y)" @click="command('redo')"><RefreshRight /></ICon>
      <ICon content="删除" @click="delObject()"><Delete /></ICon>
      <!-- <ICon content="吸附" code="icon-xifukaiqi" @click="dev()"></ICon>
      <ICon content="编辑物体" code="icon-huowutiji" @click="dev()"></ICon> -->
    </div>
    <div>
      <ICon v-if="!isFullSceen" content="全屏" code="icon-quanping" @click="setFullSceen()"></ICon>
      <ICon v-else content="退出全屏" code="icon-tuichuquanping" @click="setFullSceen()"></ICon>
      <el-button class="save" type="primary" size="small" @click="save(sceneConfig)">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import { getEditor } from '@/hooks/useEditor';
import { RefreshLeft, RefreshRight, Delete } from '@element-plus/icons-vue';
import File from './File.vue';
import { useTool } from '@/hooks/useTool';
import { sceneConfig } from '@/hooks/useConfig';

const { isFullSceen, setFullSceen, delObject, dev, save } = useTool()

const command = (action) => {
  const editor = getEditor();
  if (action === 'undo') {
    editor.undo();
  } else {
    editor.redo();
  }
};



</script>

<style scoped lang="scss">
.tool-bar {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  padding: 0 8px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  div {
    display: flex;
    align-items: center;
  }
  .save {
    margin-left: 4px;
  }
  .bar-center {
    display: flex;
    align-items: center;
  }

  :deep(.el-icon) {
    font-size: 20px;
    cursor: pointer;
    margin: 0 4px;
  }
}
</style>

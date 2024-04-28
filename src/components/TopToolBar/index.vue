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
      <ICon
        v-if="globalConfig.isAdsorption"
        content="开启网格吸附"
        code="icon-xifukaiqi"
        @click="handleAdsorption()"
      ></ICon>
      <ICon v-else content="关闭网格吸附" code="icon-xifuguanbi" @click="handleAdsorption()" />
      <ICon content="模型剖切" code="icon-qiege" @click="clipping()" />
    </div>
    <div>
      <ICon v-if="!isFullSceen" content="全屏" code="icon-quanping" @click="setFullSceen()" />
      <ICon v-else content="退出全屏" code="icon-tuichuquanping" @click="setFullSceen()" />
      <!-- <ICon content="预览" code="icon-yulan" @click="save()"></ICon> -->
      <ICon content="保存(ctrl+s)" code="icon-baocun" @click="save(sceneConfig)" />
    </div>
  </div>
</template>

<script setup>
import { getEditor } from '@/hooks/useEditor';
import { RefreshLeft, RefreshRight, Delete } from '@element-plus/icons-vue';
import File from './Menu.File.vue';
import { useTool } from '@/hooks/useTool';
import { globalConfig, sceneConfig } from '@/hooks/useConfig';
import { getViewport } from '@/hooks/useViewport';

const { isFullSceen, setFullSceen, delObject, dev, save } = useTool();

const command = (action) => {
  const editor = getEditor();
  if (action === 'undo') {
    editor.undo();
  } else {
    editor.redo();
  }
};

const handleAdsorption = () => {
  globalConfig.isAdsorption = !globalConfig.isAdsorption;
};

const clipping = () => {
  const { useClipping } = getViewport();
  useClipping();
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

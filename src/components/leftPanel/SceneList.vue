<template>
  <div class="scenc-list">
    <p class="title">场景物体</p>
    <div class="tree">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        :highlight-current="true"
        :draggable="false"
        :current-node-key="curretnKey"
        node-key="id"
        @node-click="selection"
        ref="treeRef"
      >
        <template #default="{ node, data }">
          <div class="node-content" @dblclick="focusObject(data)">
            <el-icon class="type-icon">
              <VideoCamera v-if="isCamera(data)" />
              <Sunny v-if="isLight(data)" />
              <Coin v-if="!isCamera(data) && !isLight(data)" />
            </el-icon>
            <span class="el-tree-node__label">{{ data.name }}</span>
            <el-icon class="view" @click.stop="handleVisible(data)">
              <View v-if="data.visible" />
              <Hide v-else />
            </el-icon>
            <el-icon class="delete" @click.stop="handleDetele(data)"><Delete /></el-icon>
          </div>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw, onMounted, nextTick } from 'vue';
import { getEditor } from '@/hooks/useEditor';
import { View, Hide, Delete, VideoCamera, Sunny, Coin } from '@element-plus/icons-vue';
import { RemoveObjectCommand, SetValueCommand } from '@/utils/commands/Commands';
import { isCamera, isLight, isMesh } from '@/libs';

const defaultProps = {
  children: 'children',
  label: 'name'
};

let editor = null;
const treeRef = ref();

const treeData = ref([]);
// 当前树组件选中的对象key
const curretnKey = ref(null);

// 更新树组件
const updateTree = () => {
  const { children = [] } = editor.scene;
  treeData.value = [...children];
};
// 隐藏对象
const handleVisible = (object) => {
  object.visible = !object.visible;
  const raw = toRaw(object);
  const newValue = raw.visible;
  editor.execute(new SetValueCommand(raw, 'visible', newValue));
};
// 删除对象
const handleDetele = (object) => {
  const raw = toRaw(object);
  if (raw !== null && raw.parent !== null) {
    editor.execute(new RemoveObjectCommand(raw));
  }
};
// 聚焦对象
const focusObject = (object) => {
  const raw = toRaw(object);
  editor.focus(raw);
};
// 选择对象
const selection = (object) => {
  const raw = toRaw(object);
  curretnKey.value = raw.id;
  if (raw.userData.object !== undefined) {
    // helper -> camera light ...
    editor.select(raw.userData.object);
  } else {
    editor.select(raw);
  }
};

const updateName = (id, object) => {
  let children = [...treeData.value];
  while (children.length) {
    let node = children.shift();
    if (node.id === id) {
      // object是非响应式的赋值后页面还是没更新，只能暴力更新了
      node.name = object.name;
      break;
    } else {
      node.children.length > 0 ? (children = [].concat(children, ...node.children)) : null;
    }
  }
};

onMounted(() => {
  editor = getEditor();
  editor.onEvent.objectAdded((object) => {
    updateTree();
  });
  editor.onEvent.objectRemoved((object) => {
    updateTree();
  });
  editor.onEvent.objectSelected((object) => {
    nextTick(() => {
      curretnKey.value = object ? object.id : null;
    });
  });
  editor.onEvent.refreshObjectName((object) => {
    // updateName(object.id, object)
    updateTree();
    curretnKey.value = null;
    nextTick(() => {
      curretnKey.value = object ? object.id : null;
    });
  });
});
</script>

<style scoped lang="scss">
.scenc-list {
  height: 350px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* bottom: 350px; */

  .title {
    line-height: 30px;
  }
  .tree {
    height: calc(100% - 32px);
    overflow: auto;
  }
  .el-tree {
    height: 100%;
  }
  :deep(.el-tree-node__content) {
    position: relative;
  }
  .type-icon {
    margin-right: 8px;
  }
  .node-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  .view,
  .delete {
    font-size: 12px;
    position: absolute;
    right: 8px;
    top: 7px;
  }
  .view {
    right: 28px;
  }
}
</style>

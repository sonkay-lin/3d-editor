<template>
  <div class="scenc-list">
    <p class="title">场景物体</p>
    <div class="tree" :key="key">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        :expand-on-click-node="false"
        :highlight-current="true"
        :current-node-key="curretnKey"
        :default-expanded-keys="defaultExpandedKeys"
        node-key="id"
        draggable
        :allow-drop="allowDrop"
        @node-click="selection"
        @node-drop="nodeDrop"
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
            <template v-if="data.id !== (editor.scene || {}).id">
              <el-icon class="view" @click.stop="handleVisible(data)">
                <View v-if="data.visible" />
                <Hide v-else />
              </el-icon>
              <el-icon class="delete" @click.stop="handleDetele(data)"><Delete /></el-icon>
            </template>
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
import { MoveObjectCommand } from '@/utils/commands/Commands';

const defaultProps = {
  children: 'children',
  label: 'name'
};

let editor = null;
const key = ref(0);
const treeRef = ref();

const treeData = ref([]);
// 当前树组件选中的对象key
const curretnKey = ref(null);
// 根据id映射的数据
const treeStore = ref(new Map());
// 默认展开的节点
const defaultExpandedKeys = ref([]);

// 判断是否能拖进目标节点
const allowDrop = (draggingNode, dropNode, type) => {
  if (type === 'inner') {
    const selected = editor.getObjectById(dropNode.data.id);
    if (selected.isLight || selected.isCamera) return false;
    return true;
  } else {
    return false;
  }
};
const nodeDrop = (before, after, inner, event) => {
  const object = editor.getObjectById(before.data.id);
  const parent = editor.getObjectById(after.data.id);
  // parent.children = parent.children.filter((child) => child !== object);
  // editor.moveObject(object, parent)
  editor.execute(new MoveObjectCommand(object, parent));
};

// 更新树组件
const updateTree = () => {
  const { scene } = editor;
  treeData.value = [];
  defaultExpandedKeys.value = [];

  scene.traverse((object) => {
    storeSetValue(object);
  });
  // 构建树
  scene.traverse((object) => {
    let { id, parent } = object;
    let parentId = parent && parent.id;
    const parentNode = treeStore.value.get(parentId);
    const node = treeStore.value.get(id);
    if (id === scene.id) {
      treeData.value.push(node);
    } else {
      parentNode.children.push(node);
    }
  });
  defaultExpandedKeys.value.push(scene.id);
};
// 给树形组件仓库添加新节点
const storeSetValue = (object) => {
  if (treeStore.value.get(object.id)) return;
  const { scene } = editor;
  let { id, name, parent, visible } = object;
  let parentId = parent && parent.id;
  if (id === scene.id) {
    name ? '' : (name = '场景');
    parentId = 0;
  }
  // 不拿threejs中的children，自己重新构造,直接拿three中的对象去操作可能造成页面卡顿
  const children = [];
  treeStore.value.set(object.id, { id, name, children, parentId, visible });
  return treeStore.value.get(object.id);
};

// 隐藏对象
const handleVisible = (object) => {
  const selected = editor.getObjectById(object.id);
  if (!selected) return;
  selected.visible = !selected.visible;
  const newValue = selected.visible;
  editor.execute(new SetValueCommand(selected, 'visible', newValue));
};
// 删除对象
const handleDetele = (object) => {
  const selected = editor.getObjectById(object.id);
  if (!selected) return;
  if (selected !== null && selected.parent !== null) {
    editor.execute(new RemoveObjectCommand(selected));
  }
};
// 聚焦对象
const focusObject = (object) => {
  const selected = editor.getObjectById(object.id);
  if (!selected) return;
  editor.focus(selected);
};
// 选择对象
const selection = (object) => {
  const { id } = object;
  curretnKey.value = id;
  const selected = editor.getObjectById(id);
  if (!selected) return;
  if (selected.userData.object !== undefined) {
    // helper -> camera light ...
    editor.select(selected.userData.object);
  } else {
    editor.select(selected);
  }
};

onMounted(() => {
  editor = getEditor();
  editor.event.editorCreated.add(() => {
    updateTree();
    editor.event.objectAdded.add((object) => {
      const node = storeSetValue(object);
      if (!node) return;
      const parentNode = treeStore.value.get(node.parentId);
      if (parentNode) {
        parentNode.children.push(node);
      }
      object.traverse((child) => {
        const childNode = storeSetValue(child);
        const parentNode = treeStore.value.get((childNode || {}).parentId);
        if (parentNode) {
          parentNode.children.push(childNode);
        }
      });
    });
    editor.event.objectRemoved.add((object) => {
      const { id } = object;
      const node = treeStore.value.get(id);
      const parentNode = treeStore.value.get(node.parentId);
      parentNode.children = parentNode.children.filter((item) => item.id !== id);
      treeStore.value.delete(id);
    });
    editor.event.objectSelected.add((object) => {
      nextTick(() => {
        curretnKey.value = object ? object.id : null;
      });
    });
    // 修改对象名称和显示时更新树组件UI
    editor.event.refreshObjectUI.add((object, attrs) => {
      const node = treeStore.value.get(object.id);
      if (!node) return;
      node.name = object.name;
      node.visible = object.visible;
      nextTick(() => {
        const object = editor.selected;
        curretnKey.value = object ? object.id : null;
      });
    });
    // 移动树组件对象时
    editor.event.refreshTreeUI.add(({ object, parent: parentObject }) => {
      const node = treeStore.value.get(object.id);
      const oldParent = treeStore.value.get(node.parentId);
      oldParent.children = oldParent.children.filter((child) => child.id !== node.id);
      const newParent = treeStore.value.get(parentObject.id);
      node.parentId = newParent.id;
      if (newParent.children.some((child) => child.id === node.id)) return;
      newParent.children.push(node);
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
  :deep(.el-tree) {
    height: 100%;
    .el-tree-node__content {
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
      user-select: none;
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
}
</style>

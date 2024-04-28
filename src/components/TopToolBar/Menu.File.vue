<template>
  <el-dropdown :hide-on-click="false" @command="handleCommand">
    <el-button type="primary" size="small">文件</el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="New">新建</el-dropdown-item>
        <el-dropdown-item divided command="Import">导入</el-dropdown-item>
        <el-dropdown-item divided command="ExportGeometry">导出几何体</el-dropdown-item>
        <el-dropdown-item command="ExportObject">导出物体</el-dropdown-item>
        <el-dropdown-item command="ExportScene">导出场景</el-dropdown-item>
        <!-- <el-dropdown-item divided>导出DRC</el-dropdown-item>
        <el-dropdown-item>导出GLB</el-dropdown-item>
        <el-dropdown-item>导出GLTF</el-dropdown-item>
        <el-dropdown-item>导出OBJ</el-dropdown-item>
        <el-dropdown-item>导出PLY</el-dropdown-item>
        <el-dropdown-item>导出PLY(二进制)</el-dropdown-item>
        <el-dropdown-item>导出STL</el-dropdown-item>
        <el-dropdown-item>导出STL(二进制)</el-dropdown-item>
        <el-dropdown-item>导出USDZ</el-dropdown-item> -->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <input class="file-input" type="file" multiple ref="fileInputRed" @change="fileChange" />
</template>

<script setup>
import { getEditor } from '@/hooks/useEditor';
import { getViewport } from '@/hooks/useViewport';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';

let editor;

const fileInputRed = ref();

const commands = {
  New: () => {
    ElMessageBox.alert('未保存的数据都将丢失。你确定吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showCancelButton: true
    })
      .then(() => {
        editor.clear();
        getViewport().cancelAdd()
      })
      .catch(() => {
        console.log('取消了');
      });
  },
  Import: () => {
    fileInputRed.value.click();
  },
  ExportGeometry: () => {
    const object = editor.selected;
    if (object === null) {
      ElMessage.error('请选择要导出的物体！');
      return;
    }

    const geometry = object.geometry;
    if (geometry === undefined) {
      ElMessage.error('选择的对象无几何元素！');
      return;
    }

    let output = geometry.toJSON();
    try {
      output = JSON.stringify(output, null, '\t');
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } catch (e) {
      output = JSON.stringify(output);
    }

    saveString(output, 'geometry.json');
  },
  ExportObject: () => {
    const object = editor.selected;
    if (object === null) {
      ElMessage.error('请选择要导出的物体！');
      return;
    }

    let output = object.toJSON();
    try {
      output = JSON.stringify(output, null, '\t');
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } catch (e) {
      output = JSON.stringify(output);
    }
    saveString(output, 'model.json');
  },
  ExportScene: () => {
    let output = editor.scene.toJSON();
    try {
      output = JSON.stringify(output, null, '\t');
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
    } catch (e) {
      output = JSON.stringify(output);
    }
    saveString(output, 'scene.json');
  }
};

const handleCommand = (command) => {
  commands[command]();
};

const fileChange = (files) => {
  editor.loader.loadFiles(fileInputRed.value.files);
};

const link = document.createElement('a');
function save(blob, filename) {
  if (link.href) {
    URL.revokeObjectURL(link.href);
  }

  link.href = URL.createObjectURL(blob);
  link.download = filename || 'data.json';
  link.dispatchEvent(new MouseEvent('click'));
}
function saveString(text, filename) {
  save(new Blob([text], { type: 'text/plain' }), filename);
}

onMounted(() => {
  editor = getEditor();
});
</script>

<style scoped lang="scss">
.file-input {
  display: none;
}
</style>

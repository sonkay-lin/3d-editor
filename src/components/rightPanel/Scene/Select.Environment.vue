<template>
  <div class="row">
    <el-select class="select" v-model="selectValue" @change="change">
      <el-option v-for="item in environmentList" :label="item.label" :value="item.value" :key="item.value"></el-option>
    </el-select>
    <template v-if="selectValue === 'Equirectangular'">
      <Texture @change="textureChange" ref="textureRef" />
    </template>
  </div>
</template>

<script setup>
import { sceneConfig } from '@/hooks/useConfig';
import * as THREE from 'three';
import { ref, computed, onMounted } from 'vue';
import { getEditor } from '@/hooks/useEditor';

let editor;
let texture;

const textureRef = ref();
const selectValue = computed({
  get() {
    return sceneConfig.environmentType;
  },
  set(newVal) {
    sceneConfig.environmentType = newVal;
  }
});

const environmentList = [
  {
    label: ' ',
    value: 'None'
  },
  {
    label: 'Equirect',
    value: 'Equirectangular'
  },
  {
    label: 'ModelViewer',
    value: 'ModelViewer'
  }
];
const environmentType = {
  None: () => {
    sceneConfig.environment = null;
  },
  Equirectangular: () => {
    if (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      editor.scene.environment = texture;
    }
  },
  ModelViewer: () => {
    editor.dispatch.sceneEnvironmentChanged();
  }
};
const textureChange = (_texture) => {
  texture = _texture;
  change();
};
const change = () => {
  environmentType[selectValue.value]();
};
onMounted(() => {
  editor = getEditor();
  editor.onEvent.refreshSenceUI(() => {
    if (selectValue.value === 'Equirectangular') {
      texture = editor.scene.environment;
      textureRef.value.setValue(texture);
    }
  });
});
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
}
.select {
  width: 125px;
  margin-right: 8px;
}
</style>

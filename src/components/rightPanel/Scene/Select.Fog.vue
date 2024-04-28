<template>
  <div class="row">
    <el-select class="select" v-model="selectValue" @change="change">
      <el-option v-for="item in fogList" :label="item.label" :value="item.value" :key="item.value"></el-option>
    </el-select>
    <Color v-if="selectValue !== 'None'" v-model:color="fogColor" @change="settingChange('color')"></Color>
  </div>
  <div class="row">
    <template v-if="selectValue === 'Fog'">
      <div>近点:<SlideInput v-model:value="fogNear" :min="0" onlyNumber @change="settingChange('near')" /></div>
      <div>远点:<SlideInput v-model:value="fogFar" :min="0" onlyNumber @change="settingChange('far')" /></div>
    </template>
    <template v-if="selectValue === 'FogExp2'">
      密度:<SlideInput
        v-model:value="fogDensity"
        :min="0"
        :max="0.1"
        :step="0.01"
        :precision="3"
        onlyNumber
        @change="settingChange('density')"
      />
    </template>
  </div>
</template>

<script setup>
import { sceneConfig } from '@/hooks/useConfig';
import { computed, onMounted, ref } from 'vue';
import * as THREE from 'three';
import { getEditor } from '@/hooks/useEditor';

const fogList = [
  {
    label: ' ',
    value: 'None'
  },
  {
    label: 'Linear',
    value: 'Fog'
  },
  {
    label: 'Exponential',
    value: 'FogExp2'
  }
];

let editor;
// 近点
const fogNear = ref(0.1);
// 远点
const fogFar = ref(50);
// 密度
const fogDensity = ref(0.05);

const fogColor = ref(new THREE.Color('#aaaaaa'));

const selectValue = computed({
  get() {
    return sceneConfig.fogType;
  },
  set(newVal) {
    sceneConfig.fogType = newVal;
  }
});

const change = () => {
  if (sceneConfig.fogType === 'None') {
    editor.scene.fog = null;
  } else if (sceneConfig.fogType === 'Fog') {
    editor.scene.fog = new THREE.Fog(fogColor.value, fogNear.value, fogFar.value);
  } else if (sceneConfig.fogType === 'FogExp2') {
    editor.scene.fog = new THREE.FogExp2(fogColor.value, fogDensity.value);
  }
  editor.event.sceneGraphChanged.dispatch();
};

const settingChange = (type) => {
  const { fog } = editor.scene;
  if (type === 'color') {
    fog.color = fogColor.value.clone();
  } else if (type === 'near') {
    fog.near = fogNear.value;
  } else if (type === 'far') {
    fog.far = fogFar.value;
  } else if (type === 'density') {
    fog.density = fogDensity.value;
  }
  editor.event.sceneGraphChanged.dispatch();
};

onMounted(() => {
  editor = getEditor();
  editor.event.refreshSenceUI.add(() => {
    const { fog } = editor.scene;
    if (sceneConfig.fogType === 'Fog' && fog) {
      fogColor.value = fog.color.clone();
      fogFar.value = fog.far;
      fogNear.value = fog.near;
    } else if (sceneConfig.fogType === 'FogExp2' && fog) {
      fogColor.value = fog.color.clone();
      fogDensity.value = fog.density;
    }
  });
});
</script>

<style scoped>
.select {
  width: 125px;
  margin-right: 8px;
}
</style>

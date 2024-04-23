<!-- 色调映射选择框 -->
<template>
  <el-select v-bind="$attrs" v-on="$attrs" placement="top-end">
    <el-option v-for="item in toneMappingList" :value="item.value" :label="item.label" :key="item.id"></el-option>
  </el-select>
</template>

<script setup>
import { ref } from 'vue';
import * as THREE from 'three';

const toneMappingList = ref([]);

const toneMappingOption = {
  'NoToneMapping': THREE.NoToneMapping,
  'LinearToneMapping': THREE.LinearToneMapping,
  'ReinhardToneMapping': THREE.ReinhardToneMapping,
  'CineonToneMapping': THREE.CineonToneMapping,
  'ACESFilmicToneMapping': THREE.ACESFilmicToneMapping,
  'AgXToneMapping': THREE.AgXToneMapping,
  'NeutralToneMapping': THREE.NeutralToneMapping
};

Object.keys(toneMappingOption).forEach((key) => {
  toneMappingList.value.push({
    label: key,
    value: toneMappingOption[key],
    id: toneMappingOption[key]
  });
});
</script>

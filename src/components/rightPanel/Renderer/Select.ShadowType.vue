<!-- 阴影选择框 -->
<template>
  <el-select v-bind="$attrs" v-on="$attrs" placement="top-end">
    <el-option v-for="item in shadowTypeList" :value="parseFloat(item.value)" :label="item.label" :key="item.id"></el-option>
  </el-select>
</template>

<script setup>
import { ref } from 'vue';
import * as THREE from 'three';

const shadowTypeList = ref([]);

const shadowOption = {
  'Basic': THREE.BasicShadowMap,
  'PCF': THREE.PCFShadowMap,
  'PCF Soft': THREE.PCFSoftShadowMap
};

Object.keys(shadowOption).forEach((key) => {
  shadowTypeList.value.push({
    label: key,
    value: shadowOption[key],
    id: shadowOption[key]
  });
});

</script>

<template>
  <el-select v-bind="$attrs" v-on="$attrs" placement="top-end">
    <el-option v-for="item in sideTypeList" :value="item.value" :label="item.label" :key="item.id"></el-option>
  </el-select>
</template>

<script setup>
import { ref } from 'vue';
import * as THREE from 'three';

const sideTypeList = ref([]);

const sideOption = {
  '前面-FrontSide': THREE.FrontSide,
  '背面-BackSide': THREE.BackSide,
  '双面-DoubleSide': THREE.DoubleSide
};


Object.keys(sideOption).forEach((key) => {
  sideTypeList.value.push({
    label: key,
    value: sideOption[key],
    id: sideOption[key]
  });
});
</script>

<template>
  <el-select v-bind="$attrs" v-on="$attrs" placement="top-end">
    <el-option v-for="item in blengingTypeList" :value="item.value" :label="item.label" :key="item.id"></el-option>
  </el-select>
</template>

<script setup>
import { ref } from 'vue';
import * as THREE from 'three';

const blengingTypeList = ref([]);

const blendingOption = {
  '不混合-NoBlending': THREE.NoBlending,
  '正常混合-NormalBlending': THREE.NormalBlending,
  '加法混合-AdditiveBlending': THREE.AdditiveBlending,
  '减法混合-SubtractiveBlending': THREE.SubtractiveBlending,
  '乘法混合-MultiplyBlending': THREE.MultiplyBlending,
  '自定义混合-CustomBlending': THREE.CustomBlending
};

Object.keys(blendingOption).forEach((key) => {
  blengingTypeList.value.push({
    label: key,
    value: blendingOption[key],
    id: blendingOption[key]
  });
});
</script>

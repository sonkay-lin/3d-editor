<template>
  <el-select v-bind="$attrs" v-on="$attrs">
    <el-option v-for="item in MaterialTypeList" :value="item.value" :label="item.label" :key="item.id"></el-option>
  </el-select>
</template>

<script setup>
import {
  meshMaterialOptions,
  spriteMaterialOptions,
  pointsMaterialOptions,
  lineMaterialOptions
} from './MaterialParameters';
import { computed } from 'vue';
import { useMaterial } from './useMaterial';

const { selectedObj } = useMaterial();

const MaterialTypeList = computed(() => {
  let list = [];
  if (selectedObj.value.isSprite) {
    Object.keys(spriteMaterialOptions).forEach((key) => {
      list.push({
        label: spriteMaterialOptions[key],
        value: key,
        id: key
      });
    });
  } else if (selectedObj.value.isMesh) {
    Object.keys(meshMaterialOptions).forEach((key) => {
      list.push({
        label: meshMaterialOptions[key],
        value: key,
        id: key
      });
    });
  } else if (selectedObj.value.isLine) {
    Object.keys(lineMaterialOptions).forEach((key) => {
      list.push({
        label: lineMaterialOptions[key],
        value: key,
        id: key
      });
    });
  } else if (selectedObj.value.isPoints) {
    Object.keys(pointsMaterialOptions).forEach((key) => {
      list.push({
        label: pointsMaterialOptions[key],
        value: key,
        id: key
      });
    });
  }
  return list;
});
</script>

<style scoped></style>

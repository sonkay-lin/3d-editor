<template>
  <el-select v-bind="$attrs" v-on="$attrs">
    <el-option v-for="item in MaterialTypeList" :value="item.value" :label="item.label" :key="item.id"></el-option>
  </el-select>
</template>

<script setup>
import { meshMaterialOptions } from './MaterialParameters';
import { ref } from 'vue';

const MaterialTypeList = ref([]);

Object.keys(meshMaterialOptions).forEach((key) => {
  MaterialTypeList.value.push({
    label: meshMaterialOptions[key],
    value: key,
    id: key
  });
});
</script>

<style scoped></style>

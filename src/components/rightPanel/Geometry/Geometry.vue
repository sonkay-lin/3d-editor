<template>
  <FormLayout :isShow="isShow" title="几何属性">
    <el-form-item label="类型:">
      <span class="type">{{ geometry.type }}</span>
    </el-form-item>
    <GeometryRender />
  </FormLayout>
</template>

<script setup>
import FormLayout from '../FormLayout.vue';
import { ref, onMounted, computed, toRaw } from 'vue';
import { useGeometry } from './useGeometry';
import { isShowMaterialOrGeometry } from '@/libs';
import GeometryRender from './GeometryRender';

const geometry = computed(() => (selectedObj.value ? selectedObj.value.geometry : null));
// 是否展示属性栏
const isShow = computed(() => {
  return isShowMaterialOrGeometry(selectedObj.value);
});

const { formData, selectedObj, change, registerEvent } = useGeometry()

onMounted(() => {
  registerEvent()
});
</script>

<style scoped>
.title {
  margin-bottom: 10px;
}
.type {
  color: #fff;
}
</style>

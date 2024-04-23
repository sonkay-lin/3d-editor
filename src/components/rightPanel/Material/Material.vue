<template>
  <FormLayout title="材质属性" :isShow="isShow">
    <!-- 类型 -->
    <el-form-item label="类型">
      <MaterialType v-model="formData.type" @change="change('type')"></MaterialType>
    </el-form-item>
    <!-- 识别码 -->
    <el-form-item label="识别码">
      <el-input v-model="formData.uuid"></el-input>
    </el-form-item>
    <!-- 名称 -->
    <el-form-item label="名称">
      <el-input v-model="formData.name" @change="change('name')"></el-input>
    </el-form-item>

    <MaterialRender />

    <el-form-item label="自定义数据">
      <el-input v-model="formData.userData" :rows="2" type="textarea" />
    </el-form-item>
  </FormLayout>
</template>

<script setup>
import { ref, computed, toRaw, onMounted } from 'vue';
import MaterialType from './Select.MarterialType';
import MaterialRender from './MaterialRender';
import { useMaterial } from './useMaterial';
import { isShowMaterialOrGeometry } from '@/libs';
import FormLayout from '../FormLayout.vue';

const { formData, selectedObj, registerEvent, change } = useMaterial()
// 是否展示属性栏
const isShow = computed(() => {
  return isShowMaterialOrGeometry(selectedObj.value);
});

onMounted(() => {
  registerEvent()
});
</script>

<style scoped>
.title {
  margin-bottom: 10px;
}
.el-slider {
  margin: 0 8px;
}
.space {
  margin: 0 8px;
}
.mutil-item {
  display: flex;
  flex-direction: column;
}
.mutil-item >>> .content {
  margin-bottom: 8px;
}
.mutil-item >>> .texture {
  margin-left: 12px;
}
</style>

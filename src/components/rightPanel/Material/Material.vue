<template>
  <FormLayout title="材质属性" :isShow="isShow">
    <!-- 插槽 -->
    <el-form-item label="插槽" v-if="isShowSlot">
      <el-select v-model="currentMaterial" @change="selectedMaterial">
        <el-option v-for="(item, index) in materialList" :label="`${index}:${item.name}`" :value="index" :key="index"></el-option>
      </el-select>
    </el-form-item>
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

    <MaterialRender :key="key"/>

    <el-form-item label="自定义数据">
      <el-input v-model="formData.userData" @change="change('userData')" :rows="2" type="textarea" />
    </el-form-item>
  </FormLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import MaterialType from './Select.MarterialType';
import MaterialRender from './MaterialRender';
import { useMaterial } from './useMaterial';
import { isShowMaterialOrGeometry } from '@/libs';
import FormLayout from '../FormLayout.vue';

const { key, formData, selectedObj, currentMaterial, materialList, selectedMaterial, registerEvent, change } = useMaterial();

// 是否展示属性栏
const isShow = computed(() => {
  return isShowMaterialOrGeometry(selectedObj.value);
});

const isShowSlot = computed(() => {
  if (selectedObj.value && Array.isArray(selectedObj.value.material)) {
    return true;
  }
  return false;
});

onMounted(() => {
  registerEvent();
});
</script>

<style scoped lang="scss">
.newMaterial {
  margin-bottom: 10px;
  display: flex;
}
.material-list {
  width: 100%;
  margin-bottom: 18px;
  border: 1px solid var(--el-border-color);
  min-height: 24px;
  max-height: 180px;
  overflow: scroll;
  scrollbar-width: none;
  .material-item {
    line-height: 24px;
    // font-size: var(--el-form-label-font-size);
    font-size: 12px;
    padding: 0 8px;
    cursor: pointer;
  }
  .material-item:hover,
  .active {
    background-color: #262727;
  }
}
</style>

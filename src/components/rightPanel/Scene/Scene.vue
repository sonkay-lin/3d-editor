<template>
  <FormLayout title="场景" :isShow="true">
    <!-- <el-form-item label="场景名称">
      <el-input class="input-name" v-model="formData.name"/>
    </el-form-item> -->
    <el-form-item label="背景">
      <BackgroundSelect />
    </el-form-item>
    <el-form-item label="环境">
      <EnvironmentSelect />
    </el-form-item>
    <el-form-item label="雾">
      <FogSelect />
    </el-form-item>
  </FormLayout>
</template>

<script setup>
import FormLayout from '../FormLayout.vue';
import BackgroundSelect from './Select.Background.vue'
import EnvironmentSelect from './Select.Environment.vue';
import FogSelect from './Select.Fog.vue';

</script>

<style scoped>
.title {
  margin-bottom: 10px;
}
.row {
  display: flex;
  align-items: center;
}
.input-name {
  width: 125px;
}
</style>

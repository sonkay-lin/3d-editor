<template>
  <FormLayout title="对象属性" :isShow="isShow">
    <el-form-item label="类型">
      <span class="type">{{ formData.type }}</span>
    </el-form-item>
    <!-- 识别码 -->
    <el-form-item label="识别码">
      <el-input v-model="formData.uuid" @change="change"></el-input>
    </el-form-item>
    <!-- 名称 -->
    <el-form-item label="名称">
      <el-input v-model="formData.name" @change="change('name')"></el-input>
    </el-form-item>
    <!-- 位置 -->
    <el-form-item label="位置">
      <div>
        x：<SlideInput v-model:value="formData.position.x" @change="change('position')"></SlideInput>
      </div>
      <div>
        y：<SlideInput v-model:value="formData.position.y" @change="change('position')"></SlideInput>
      </div>
      <div>
        z：<SlideInput v-model:value="formData.position.z" @change="change('position')"></SlideInput>
      </div>
    </el-form-item>

    <Object3DRender />

    <!-- 可见性 -->
    <el-form-item label="可见性">
      <el-checkbox v-model="formData.visible" @change="change('visible')" />
    </el-form-item>
    <!-- 视锥体裁剪 -->
    <el-form-item label="视锥体裁剪">
      <el-checkbox v-model="formData.frustumcull" @change="change('frustumcull')" />
    </el-form-item>
    <!-- 渲染次序 -->
    <el-form-item label="渲染次序">
      <el-input-number v-model="formData.renderOrder" @change="change('renderOrder')" />
    </el-form-item>
    <!-- 自定义数据 -->
    <el-form-item label="自定义数据">
      <el-input v-model="formData.userData" :rows="2" type="textarea" @change="change('userData')" />
    </el-form-item>
  </FormLayout>
</template>

<script setup>
import { ref, reactive, toRaw, onMounted, computed } from 'vue';
import Object3DRender from './Object3DRender';
import { useObject3D } from './useObject3D';
import FormLayout from '../FormLayout.vue';

const { formData, selectedObj, change, registerEvent } = useObject3D();
const isShow = computed(() => (selectedObj.value ? true : false));

onMounted(() => {
  registerEvent();
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

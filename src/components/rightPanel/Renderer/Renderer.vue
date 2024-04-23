<template>
  <FormLayout title="渲染器" :isShow="true">
    <el-form-item label="抗锯齿">
      <el-checkbox v-model="globalConfig.renderer.antialias" @change="change" />
    </el-form-item>
    <el-form-item label="阴影">
      <div class="row">
        <el-checkbox v-model="globalConfig.renderer.shadowMap.enabled" @change="udpdateRenderer" />
        <ShadowTypeSelect class="select" v-model="globalConfig.renderer.shadowMap.type" @change="udpdateRenderer" />
      </div>
    </el-form-item>
    <el-form-item label="色调映射">
      <ToneMappingSelect v-model="globalConfig.renderer.toneMapping" @change="udpdateRenderer" />
    </el-form-item>
  </FormLayout>
</template>

<script setup>
import { getEditor } from '@/hooks/useEditor';
import { ref, onMounted } from 'vue';
import FormLayout from '../FormLayout.vue';
import ShadowTypeSelect from './Select.ShadowType.vue';
import ToneMappingSelect from './Select.ToneMapping.vue';
import { globalConfig } from '@/hooks/useConfig'

let editor = null;

const change = () => {
  editor.createRenderer(globalConfig.renderer);
};

const udpdateRenderer = () => {
  const { shadowMap, toneMapping } = globalConfig.renderer;
  editor.renderer.shadowMap.enabled = shadowMap.enabled;
  editor.renderer.shadowMap.type = parseFloat(shadowMap.type);
  editor.renderer.toneMapping = parseFloat(toneMapping);
  editor.dispatch.rendererUpdated();
};

onMounted(() => {
  editor = getEditor();
  console.log(globalConfig)
});
</script>

<style scoped>
.title {
  margin-bottom: 10px;
}
.row {
  display: flex;
  align-items: center;
}
.select {
  width: 140px;
  margin-left: 12px;
}
</style>

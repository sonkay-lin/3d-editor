<template>
  <div class="content">
    <el-checkbox v-model="isActive" :disabled="disabled" @change="onChange" />
    <Texture class="texture-content" ref="textureRef" @change="textureChange" />
    <MapTextureInput :property="props.property"/>
  </div>
</template>

<script setup>
import { getEditor } from '@/hooks/useEditor';
import * as THREE from 'three';
import { ref, onMounted, onUnmounted, watch, computed, toRaw } from 'vue';
import { SetMaterialMapCommand } from '@/utils/commands/Commands';
import { offEvent } from '@/utils/event';
import { useMaterial } from './useMaterial';
import MapTextureInput from './MapTexture.Input';

const props = defineProps({
  property: {
    type: String,
    default: ''
  }
});
const { selectedObj } = useMaterial();

let editor = null;
let object = null;
let material = null;
let materialSlot = 0;
let texture = null;
const colorMaps = ['map', 'emissiveMap', 'sheenColorMap', 'specularColorMap', 'envMap'];
const textureRef = ref();
const disabled = ref(true);
const isActive = ref(false);

// selectedObj.value = null时组件被销毁
watch(
  () => selectedObj.value,
  (newVal) => {
    texture = null;
    objectSelected(newVal);
  }
);

const textureChange = (_texture) => {
  texture = _texture;
  object = editor.selected;
  if (!object) return;
  material = object.material;
  onMapChange(_texture);
};

const onMapChange = (_texture) => {
  if (!_texture) {
    if (
      colorMaps.includes(props.property) &&
      _texture.isDataTexture !== true &&
      _texture.colorSpace !== THREE.SRGBColorSpace
    ) {
      _texture.colorSpace = THREE.SRGBColorSpace;
      material.needsUpdate = true;
    }
  }
  disabled.value = false;
  onChange();
};

const onChange = () => {
  const newMap = isActive.value ? texture : null;
  const { property } = props;
  if (material[property] !== newMap) {
    if (newMap !== null) {
      const geometry = object.geometry;
      if (geometry.hasAttribute('uv') === false) console.warn("Geometry doesn't have uvs:", geometry);
      if (property === 'envMap') newMap.mapping = THREE.EquirectangularReflectionMapping;
    }
    editor.execute(new SetMaterialMapCommand(object, property, newMap, materialSlot));
  }
};

const update = async () => {
  if (object === null || object.material === undefined) return;
  material = editor.getObjectMaterial(object, materialSlot);
  const { property } = props;
  if (property in material) {
    if (material[property] !== null) {
      textureRef.value.setValue(material[property]);
      texture = material[property];
    }
    isActive.value = texture !== null;
    disabled.value = texture === null;
  }
};
const objectSelected = (selected) => {
  if (!selected) return;
  object = toRaw(selected);
  textureRef.value?.setValue(null);
  update();
};
const materialChanged = () => update;
onMounted(async () => {
  editor = getEditor();
  // 事件先触发MapTure组件才被创建，监听事件是在触发后创建的,
  // 所以不会触发objectSelected,所以采用useMaterial中的selectedObj
  // editor.onEvent.objectSelected(objectSelected);
  objectSelected(selectedObj.value);
  editor.onEvent.materialChanged(materialChanged);
});
onUnmounted(() => {
  // offEvent.objectSelected(objectSelected);
  offEvent.materialChanged(materialChanged);
});
</script>

<style scoped lang="scss">
.content {
  display: flex;
  height: 24px;
  justify-content: start;
  align-items: center;
  .el-input-number {
    width: 42px !important;
  }
  .texture-content {
    margin-left: 12px;
    display: flex;
    align-items: center;
  }
  :deep(.el-checkbox) {
    margin-right: 0;
  }
  :deep(.texture) {
    display: flex;
    /* justify-content: center; */
  }
}
</style>

<template>
  <div class="row">
    <el-select class="select" v-model="selectValue" @change="change" v-bind="$attrs" v-on="$attrs">
      <el-option v-for="item in backgroundList" :label="item.label" :value="item.value" :key="item.value"></el-option>
    </el-select>
    <template v-if="selectValue === 'Color'">
      <Color v-model:color="color" @change="colorChange" />
    </template>
    <Texture v-show="selectValue === 'Texture'" @change="textureChange" ref="textureRef" />

    <Texture v-show="selectValue === 'Equirectangular'" @change="equirectTextureChange" ref="equirectTextureRef" />
  </div>
  <div class="row" v-if="selectValue === 'Equirectangular'">
    <div>
      模糊:<SlideInput
        v-model:value="backgroundBlurriness"
        :min="0"
        :max="1"
        onlyNumber
        @change="numberChange('backgroundBlurriness')"
      />
    </div>
    <div>
      亮度:<SlideInput v-model:value="backgroundIntensity" :min="0" onlyNumber @change="numberChange('backgroundIntensity')" />
    </div>
  </div>
</template>

<script setup>
import { sceneConfig } from '@/hooks/useConfig';
import { getEditor } from '@/hooks/useEditor';
import * as THREE from 'three';
import { ref, computed, onMounted } from 'vue';
let editor;
let backgroundTexture;
let equirectangularTexture;
const textureRef = ref();
const equirectTextureRef = ref();
const color = ref(new THREE.Color('#aaaaaa'));
// 背景模糊度
const backgroundBlurriness = ref(0);
// 背景亮度
const backgroundIntensity = ref(1);
const selectValue = computed({
  get() {
    return sceneConfig.backgroundType;
  },
  set(newVal) {
    sceneConfig.backgroundType = newVal;
  }
});

const backgroundList = [
  {
    label: ' ',
    value: 'None'
  },
  {
    label: '颜色-Color',
    value: 'Color'
  },
  {
    label: '贴图-Texture',
    value: 'Texture'
  },
  {
    label: '全景图-Equirect',
    value: 'Equirectangular'
  }
];
const backgroundType = {
  None: () => {
    editor.scene.background = null;
    editor.dispatch.sceneGraphChanged();
  },
  Color: () => {
    editor.scene.background = color.value;
    editor.dispatch.sceneGraphChanged();
  },
  Texture: () => {
    if (!backgroundTexture) return;
    const { texture: _texture } = textureRef.value;
    if (!_texture) {
      textureRef.value.setValue(backgroundTexture);
    }
    editor.scene.background = backgroundTexture;
    editor.dispatch.sceneGraphChanged();
  },
  Equirectangular: () => {
    if (!equirectangularTexture) return;
    const { texture: _texture } = equirectTextureRef.value;
    if (!_texture) {
      equirectTextureRef.value.setValue(equirectangularTexture);
    }
    equirectangularTexture.mapping = THREE.EquirectangularReflectionMapping;
    editor.scene.background = equirectangularTexture;
    editor.scene.backgroundBlurriness = backgroundBlurriness.value;
    editor.scene.backgroundIntensity = backgroundIntensity.value;
    editor.dispatch.sceneGraphChanged();
  }
};
// 获取背景贴图
const textureChange = (_texture) => {
  backgroundTexture = _texture;
  change();
};
// 获取全景图
const equirectTextureChange = (_texture) => {
  equirectangularTexture = _texture;
  change();
};
// 修改背景颜色
const colorChange = () => {
  backgroundType.Color();
};
// 修改背景数值
const numberChange = (type) => {
  if (type === 'backgroundBlurriness') {
    editor.scene.backgroundBlurriness = backgroundBlurriness.value;
  } else if (type === 'backgroundIntensity') {
    editor.scene.backgroundIntensity = backgroundIntensity.value;
  }
  editor.dispatch.sceneGraphChanged();
};
// 修改背景类型
const change = () => {
  backgroundType[selectValue.value]();
};

onMounted(() => {
  editor = getEditor();
  // 场景加载完，将UI赋值为已有的数据
  editor.onEvent.refreshSenceUI(() => {
    if (selectValue.value === 'Color') {
      color.value = editor.scene.background;
    } else if (selectValue.value === 'Texture') {
      backgroundTexture = editor.scene.background;
      textureRef.value.setValue(backgroundTexture);
    } else if (selectValue.value === 'Equirectangular') {
      equirectangularTexture = editor.scene.background;
      equirectTextureRef.value.setValue(equirectangularTexture);
      backgroundBlurriness.value = editor.scene.backgroundBlurriness;
      backgroundIntensity.value = editor.scene.backgroundIntensity;
    }
  });
});
</script>

<style scoped>
.row {
  display: flex;
  align-items: center;
}
.select {
  width: 125px;
  margin-right: 8px;
}
</style>

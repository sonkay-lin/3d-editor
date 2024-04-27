import { computed, reactive, watch } from 'vue';
import * as THREE from 'three';

const orgConfig = {
  // 网格
  isShowGrid: true,
  // 坐标轴
  isShowAxis: false,
  // 辅助线
  isShowHelper: true,
  // 吸附
  isAdsorption: false,
  // transform控制器
  transform: {
    mode: 'translate',
    space: 'world',
    showX: true,
    showY: true,
    showZ: true
  },
  renderer: {
    // 抗锯齿
    antialias: true,
    // 阴影
    shadowMap: {
      enabled: false,
      type: THREE.PCFShadowMap
    },
    // 色调映射
    toneMapping: THREE.NoToneMapping
    // toneMappingExposure
  }
};

// 这里的配置需要一改变就保存到本地
export const globalConfig = reactive({
  // 网格
  isShowGrid: true,
  // 坐标轴
  isShowAxis: false,
  // 辅助线
  isShowHelper: true,
  // 吸附
  isAdsorption: false,
  // transform控制器
  transform: {
    mode: 'translate',
    space: 'world',
    showX: true,
    showY: true,
    showZ: true
  },
  renderer: {
    // 抗锯齿
    antialias: true,
    // 阴影
    shadowMap: {
      enabled: false,
      type: THREE.PCFShadowMap
    },
    // 色调映射
    toneMapping: THREE.NoToneMapping
    // toneMappingExposure
  }
});

// 这里的配置需要用户自己保存
export const sceneConfig = reactive({
  // 背景类型
  backgroundType: 'None',

  // 环境类型
  environmentType: 'None',

  // 雾类型
  fogType: 'None'
});

export const initConfig = () => {
  try {
    const config = JSON.parse(localStorage.getItem('config'));
    if (config) {
      console.log(config);
      Object.keys(globalConfig).forEach((key) => {
        globalConfig[key] = config[key];
      });
    }
    const scene = JSON.parse(localStorage.getItem('sceneConfig'));
    if (scene) {
      Object.keys(sceneConfig).forEach((key) => {
        sceneConfig[key] = scene[key];
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const resetConfig = () => {
  Object.keys(globalConfig).forEach((key) => {
    globalConfig[key] = orgConfig[key];
  });
  localStorage.removeItem('config');
  localStorage.removeItem('sceneConfig');
};

watch(
  () => globalConfig,
  (value) => {
    const newConfig = JSON.stringify(value);
    localStorage.setItem('config', newConfig);
  },
  { deep: true }
);

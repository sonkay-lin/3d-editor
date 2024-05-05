import { getEditor } from '@/hooks/useEditor';
import * as THREE from 'three';

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

export const getObjectType = (object) => {};
// 组
export const isGroup = (object) => {
  if (!object) return;
  return object.isGroup;
};
// 是否是相机
export const isCamera = (object) => {
  if (!object) return;
  return object.isCamera;
};
// 是否是光线
export const isLight = (object) => {
  if (!object) return;
  return object.isLight;
};
export const isMesh = (object) => {
  if (!object) return;
  return object.isMesh;
};
// 正交相机
export const isOrthographicCamera = (object) => {
  if (!object) return;
  return object.isOrthographicCamera;
};
// 透视相机
export const isPerspectiveCamera = (object) => {
  if (!object) return;
  return object.isPerspectiveCamera;
};
// 环境光
export const isAmbientLight = (object) => {
  if (!object) return;
  return object.isAmbientLight;
};
// 平行光
export const isDirectionalLight = (object) => {
  if (!object) return;
  return object.isDirectionalLight;
};
// 半球光
export const isHemisphereLight = (object) => {
  if (!object) return;
  return object.isHemisphereLight;
};
// 点光源
export const isPointLight = (object) => {
  if (!object) return;
  return object.isPointLight;
};
// 聚光灯
export const isSpotLight = (object) => {
  if (!object) return;
  return object.isSpotLight;
};
export const isScene = (object) => {
  if (!object) return;
  return object.isScene;
};
export const isShowMaterialOrGeometry = (object) => {
  if (!object) return;
  if (!object.material || !object.geometry) {
    return false;
  }
  return true;
};

export const materialTraverse = (object, callback) => {
  if (Array.isArray(object.material)) {
    object.material.forEach(item => {
      callback(item)
    })
  } else {
    callback(object.material)
  }
}

import { getEditor } from '@/hooks/useEditor';
import * as THREE from 'three';

export const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export const getObjectType = (object) => {};
// 组
export const isGroup = (object) => {
  if (!object) return;
  return object.isGroup;
};
// 是否是相机
export const isCamera = (object) => {
  if (!object) return
  return object.isCamera
}
// 是否是光线
export const isLight = (object) => {
  if (!object) return
  return object.isLight
}
export const isMesh = (object) => {
  if (!object) return
  return object.isMesh
}
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
  if (!object) return
  return object.isScene
}
export const isShowMaterialOrGeometry = (object) => {
  if (!object) return;
  if (
    isGroup(object) ||
    isOrthographicCamera(object) ||
    isPerspectiveCamera(object) ||
    isAmbientLight(object) ||
    isDirectionalLight(object) ||
    isHemisphereLight(object) ||
    isPointLight(object) ||
    isSpotLight(object) || 
    isScene(object)
  ) {
    return false;
  }
  return true;
};

// 屏幕坐标转世界坐标
export function screenToWorld(x, y) {
  const editor = getEditor()
  const { camera } = editor
	const vector = new THREE.Vector3();
	vector.set(
		(x / window.innerWidth) * 2 - 1,
		-(y / window.innerHeight) * 2 + 1,
		0.5
	);
	vector.unproject(camera);

	const dir = vector.sub(camera.position).normalize();
	const distance = -camera.position.z / dir.z;
	return camera.position.clone().add(dir.multiplyScalar(distance));
}



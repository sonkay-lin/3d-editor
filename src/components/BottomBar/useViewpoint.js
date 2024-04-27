import * as THREE from 'three';
import { getEditor } from '@/hooks/useEditor';
import { getViewport } from '@/hooks/useViewport';
import { reactive, ref } from 'vue';
const currentViewPoint = ref('default');
// 默认的相机
const defaultCamera = [
  {
    value: 'default',
    label: '默认视角',
    handle: () => {
      const editor = getEditor();

      const camera = editor.viewpointCamera[0];
      editor.camera = editor.cameras[camera.uuid];

      editor.setViewportCamera(camera.uuid);
    }
  }
];

// 视图视角
const viewpoints = [
  {
    value: 'front',
    label: '正视图',
    handle: () => {
      const editor = getEditor();

      const camera = editor.viewpointCamera[1];
      camera.position.set(0, 0, 1000);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      editor.camera = editor.cameras[camera.uuid];

      editor.setViewportCamera(camera.uuid);
    }
  },
  {
    value: 'back',
    label: '后视图',
    handle: () => {
      const editor = getEditor();

      const camera = editor.viewpointCamera[1];
      camera.position.set(0, 0, -1000);
      camera.rotation.y = 180 * THREE.MathUtils.DEG2RAD;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      editor.camera = editor.cameras[camera.uuid];

      editor.setViewportCamera(camera.uuid);
    }
  },
  {
    value: 'left',
    label: '左视图',
    handle: () => {
      const editor = getEditor();

      const camera = editor.viewpointCamera[1];
      camera.position.set(-1000, 0, 0);
      camera.rotation.y = -90 * THREE.MathUtils.DEG2RAD;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      editor.camera = editor.cameras[camera.uuid];

      editor.setViewportCamera(camera.uuid);
    }
  },
  {
    value: 'right',
    label: '右视图',
    handle: () => {
      const editor = getEditor();

      const camera = editor.viewpointCamera[1];
      camera.position.set(1000, 0, 0);
      camera.rotation.y = 90 * THREE.MathUtils.DEG2RAD;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      editor.camera = editor.cameras[camera.uuid];
      
      editor.setViewportCamera(camera.uuid);
    }
  },
  {
    value: 'top',
    label: '俯视图',
    handle: () => {
      const editor = getEditor();

      const camera = editor.viewpointCamera[1];
      camera.position.set(0, 1000, 0);
      camera.rotation.x = -90 * THREE.MathUtils.DEG2RAD;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      editor.camera = editor.cameras[camera.uuid];
      
      editor.setViewportCamera(camera.uuid);
    }
  },
  {
    value: 'bottom',
    label: '仰视图',
    handle: () => {
      const editor = getEditor();
      
      const camera = editor.viewpointCamera[1];
      camera.position.set(0, -1000, 0);
      camera.rotation.y = 90 * THREE.MathUtils.DEG2RAD;
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      editor.camera = editor.cameras[camera.uuid];
      
      editor.setViewportCamera(camera.uuid);
    }
  }
];
// 用户自己添加的相机
const customerCamera = reactive([]);

export { currentViewPoint, defaultCamera, viewpoints, customerCamera };

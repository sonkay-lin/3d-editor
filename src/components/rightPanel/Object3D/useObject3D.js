import { ref, reactive, toRaw } from 'vue';
import { getEditor } from '@/hooks/useEditor';
import {
  SetPositionCommand,
  SetRotationCommand,
  SetScaleCommand,
  SetValueCommand,
  SetColorCommand
} from '@/utils/commands/Commands';
import { isObject } from '@/libs';
import * as THREE from 'three';

let editor = null;
const selectedObj = ref(null);
const formData = reactive({
  type: '',
  uuid: '',
  name: '',
  position: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Vector3(0, 0, 0),
  scale: new THREE.Vector3(0, 0, 0),

  castShadow: false, //产生阴影
  receiveShadow: false, //接受阴影

  intensity: 1, // 强度
  color: new THREE.Color('#ffffff'), // 光颜色
  groundColor: new THREE.Color('#ffffff'), // 基色

  distance: 0,
  decay: 2, // 衰减
  angle: 0.314, // 角度
  penumbra: 0, // 边缘

  shadow: {
    bias: 0, // 阴影偏移
    normalBias: 0, // 阴影法线偏移
    radius: 1 // 阴影半径
  },

  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  near: 0,
  far: 0,
  fov: 0, //视角

  visible: true,
  frustumcull: true, //视锥体裁剪
  renderOrder: 0, //渲染次序
  userDate: {}
});

const commands = {
  name: (object) => {
    editor.execute(new SetValueCommand(object, 'name', formData.name));
  },
  position: (object) => {
    const newPosition = toRaw(formData.position);
    editor.execute(new SetPositionCommand(object, newPosition));
  },
  rotation: (object) => {
    const { x, y, z } = toRaw(formData.rotation);
    const newRotation = new THREE.Euler(
      x * THREE.MathUtils.DEG2RAD,
      y * THREE.MathUtils.DEG2RAD,
      z * THREE.MathUtils.DEG2RAD
    );
    editor.execute(new SetRotationCommand(object, newRotation));
  },
  scale: (object) => {
    const newScale = toRaw(formData.scale);
    editor.execute(new SetScaleCommand(object, newScale));
  },

  intensity: (object) => {
    editor.execute(new SetValueCommand(object, 'intensity', formData.intensity));
  },
  color: (object) => {
    const newColor = formData.color.clone();
    editor.execute(new SetColorCommand(object, 'color', newColor));
  },
  groundColor: (object) => {
    const newColor = formData.groundColor.clone();
    editor.execute(new SetColorCommand(object, 'groundColor', newColor));
  },

  distance: (object) => {
    editor.execute(new SetValueCommand(object, 'distance', formData.distance));
  },
  decay: (object) => {
    editor.execute(new SetValueCommand(object, 'decay', formData.decay));
  },
  angle: (object) => {
    editor.execute(new SetValueCommand(object, 'angle', formData.angle));
  },
  penumbra: (object) => {
    editor.execute(new SetValueCommand(object, 'penumbra', formData.penumbra));
  },

  castShadow: (object) => {
    editor.execute(new SetValueCommand(object, 'castShadow', formData.castShadow));
  },
  receiveShadow: (object) => {
    editor.execute(new SetValueCommand(object, 'receiveShadow', formData.receiveShadow));
  },

  bias: (object) => {
    editor.execute(new SetValueCommand(object, 'shadow.bias', formData.shadow.bias));
  },
  normalBias: (object) => {
    editor.execute(new SetValueCommand(object, 'shadow.normalBias', formData.shadow.normalBias));
  },
  radius: (object) => {
    editor.execute(new SetValueCommand(object, 'shadow.radius', formData.shadow.radius));
  },

  left: (object) => {
    editor.execute(new SetValueCommand(object, 'left', formData.left));
    object.updateProjectionMatrix();
  },
  right: (object) => {
    editor.execute(new SetValueCommand(object, 'right', formData.right));
    object.updateProjectionMatrix();
  },
  top: (object) => {
    editor.execute(new SetValueCommand(object, 'top', formData.top));
    object.updateProjectionMatrix();
  },
  bottom: (object) => {
    editor.execute(new SetValueCommand(object, 'bottom', formData.bottom));
    object.updateProjectionMatrix();
  },
  near: (object) => {
    editor.execute(new SetValueCommand(object, 'near', formData.near));
    if (object.isOrthographicCamera) {
      object.updateProjectionMatrix();
    }
  },
  far: (object) => {
    editor.execute(new SetValueCommand(object, 'far', formData.far));
    if (object.isOrthographicCamera) {
      object.updateProjectionMatrix();
    }
  },
  fov: (object) => {
    editor.execute(new SetValueCommand(object, 'fov', formData.fov));
    object.updateProjectionMatrix();
  },

  visible: (object) => {
    editor.execute(new SetValueCommand(object, 'visible', formData.visible));
  },
  frustumcull: (object) => {
    editor.execute(new SetValueCommand(object, 'frustumcull', formData.frustumcull));
  },
  renderOrder: (object) => {
    editor.execute(new SetValueCommand(object, 'renderOrder', formData.renderOrder));
  },
  userData: (object) => {
    editor.execute(new SetValueCommand(object, 'userData', formData.userData));
  }
};

// 将rotation转成input输入框上的值
const rotationToInput = (rotation) => {
  const { x, y, z } = rotation.clone();
  const value = new THREE.Vector3();
  value.x = THREE.MathUtils.radToDeg(x);
  value.y = THREE.MathUtils.radToDeg(y);
  value.z = THREE.MathUtils.radToDeg(z);
  return value;
};

const change = (params) => {
  const object = toRaw(selectedObj.value);
  commands[params](object);
};

const updateUI = (object) => {
  const selected = toRaw(selectedObj.value);
  if (!object || selected !== editor.selected) return;
  Object.keys(formData).forEach((key) => {
    if (object[key] === undefined) return;
    if (key === 'rotation') {
      formData[key] = rotationToInput(object[key]);
      return;
    }
    if (isObject(object[key])) {
      if (key === 'shadow') {
        // formData[key] = deepcopy(object[key])
        Object.keys(formData[key]).forEach((k) => {
          formData[key][k] = object[key][k];
        });
      } else {
        formData[key] = object[key].clone();
      }
      return;
    }
    formData[key] = object[key];
  });
};

const registerEvent = () => {
  editor = getEditor();
  editor.onEvent.objectSelected((object) => {
    selectedObj.value = object;
    updateUI(object);
  });
  editor.onEvent.refreshSidebarObject3D((object) => {
    updateUI(object);
  });
  editor.onEvent.objectChanged((object) => {
    updateUI(object);
  });
};

export const useObject3D = () => {
  return {
    formData,
    selectedObj,
    change,
    updateUI,
    registerEvent
  };
};

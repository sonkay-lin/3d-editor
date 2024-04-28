import { materialClasses, vertexShaderVariables } from './MaterialParameters';
import { getEditor } from '@/hooks/useEditor';
import { computed, nextTick, ref, toRaw } from 'vue';
import {
  SetMaterialCommand,
  SetMaterialValueCommand,
  SetMaterialColorCommand,
} from '@/utils/commands/Commands';
import { isShowMaterialOrGeometry } from '@/libs';

let editor;
const selectedObj = ref(null);
const formData = ref({});
const materialType = computed(() => {
  if (!selectedObj.value) return '';
  const { material = {} } = selectedObj.value;
  return material.type;
});

const updateUI = () => {};

const change = (params) => {
  try {
    const object = toRaw(selectedObj.value);
    commands[params]?.(object);
  } catch (error) {
    console.error(error);
  }
};

const commands = {
  type: (object) => {
    const { type } = formData.value;
    const material = new materialClasses[type]();
    if (material.type === 'RawShaderMaterial') {
      material.vertexShader = vertexShaderVariables + material.vertexShader;
    }
    const newMaterial = material;
    formData.value = {}
    nextTick(() => {
      formData.value = material;
      formData.value.userData = JSON.stringify(material.userData)
      if (Array.isArray(object.material)) {
        editor.removeMaterial( object.material[ 0 ] );
      } else {
        editor.removeMaterial( object.material );
      }
      editor.execute(new SetMaterialCommand(object, newMaterial, 0), `修改材质类型`);
      editor.addMaterial(newMaterial);
    })
  },
  name: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'name', formData.value.name, 0));
  },
  color: (object) => {
    const color = formData.value.color.clone();
    editor.execute(new SetMaterialColorCommand(object, 'color', color, 0));
  },
  reflectivity: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'reflectivity', formData.value.reflectivity, 0));
  },
  emissive: (object) => {
    const color = formData.value.emissive.clone();
    editor.execute(new SetMaterialColorCommand(object, 'emissive', color, 0));
  },
  emissiveIntensity: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'emissiveIntensity', formData.value.emissiveIntensity, 0));
  },
  specular: (object) => {
    const color = formData.value.specular.clone();
    editor.execute(new SetMaterialColorCommand(object, 'specular', color, 0));
  },
  shininess: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'shininess', formData.value.shininess, 0));
  },
  reflectivity: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'reflectivity', formData.value.reflectivity, 0));
  },
  roughness: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'roughness', formData.value.roughness, 0));
  },
  metalness: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'metalness', formData.value.metalness, 0));
  },
  clearcoat: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'clearcoat', formData.value.clearcoat, 0));
  },
  clearcoatRoughness: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'clearcoatRoughness', formData.value.clearcoatRoughness, 0));
  },
  iridescence: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'iridescence', formData.value.iridescence, 0));
  },
  sheen: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'sheen', formData.value.sheen, 0));
  },
  sheenRoughness: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'sheenRoughness', formData.value.sheenRoughness, 0));
  },
  transmission: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'transmission', formData.value.transmission, 0));
  },
  attenuationDistance: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'attenuationDistance', formData.value.attenuationDistance, 0));
  },
  attenuationColor: (object) => {
    const color = formData.value.attenuationColor.clone();
    editor.execute(new SetMaterialColorCommand(object, 'attenuationColor', color, 0));
  },
  thickness: (object) => {
    editor.execute(new SetMaterialColorCommand(object, 'thickness', formData.value.thickness, 0));
  },
  vertexColors: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'vertexColors', formData.value.vertexColors, 0));
  },
  depthPacking: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'depthPacking', formData.value.depthPacking, 0));
  },

  aoMapIntensity: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'aoMapIntensity', formData.value.aoMapIntensity, 0));
  },
  bumpScale: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'bumpScale', formData.value.bumpScale, 0));
  },
  displacementScale: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'displacementScale', formData.value.displacementScale, 0));
  },
  normalScale: (object) => {
    const normalScale = formData.value.normalScale.clone();
    editor.execute(new SetMaterialValueCommand(object, 'normalScale', normalScale, 0));
  },
  clearcoatNormalScale: (object) => {
    const clearcoatNormalScale = formData.value.clearcoatNormalScale.clone();
    editor.execute(new SetMaterialValueCommand(object, 'clearcoatNormalScale', clearcoatNormalScale, 0));
  },
  iridescenceThicknessRange: (object) => {
    editor.execute(
      new SetMaterialValueCommand(object, 'iridescenceThicknessRange', formData.value.iridescenceThicknessRange, 0)
    );
  },

  blending: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'blending', formData.value.blending, 0));
  },
  side: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'side', formData.value.side, 0));
  },
  flatShading: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'flatShading', formData.value.flatShading, 0));
  },
  opacity: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'opacity', formData.value.opacity, 0));
  },
  transparent: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'transparent', formData.value.transparent, 0));
  },
  alphaTest: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'alphaTest', formData.value.alphaTest, 0));
  },
  forceSinglePass: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'forceSinglePass', formData.value.forceSinglePass, 0));
  },
  depthTest: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'depthTest', formData.value.depthTest, 0));
  },
  depthWrite: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'depthWrite', formData.value.depthWrite, 0));
  },
  wireframe: (object) => {
    editor.execute(new SetMaterialValueCommand(object, 'wireframe', formData.value.wireframe, 0));
  },

  userData: (object) => {
    const userData = JSON.stringify()
    editor.execute(new SetMaterialValueCommand(object, 'userData', userData, 0));
  }
};

const registerEvent = () => {
  editor = getEditor();
  editor.event.objectSelected.add((object) => {
    selectedObj.value = object;
    if (!object) {
      formData.value.type = '';
      return;
    }
    // 光线,相机不需要走下面步骤
    if (!isShowMaterialOrGeometry(object)) return;
    const { material } = selectedObj.value;
    formData.value = material.clone();
    formData.value.uuid = material.uuid;
    formData.value.userData = JSON.stringify(material.userData);
  });
  editor.event.materialChanged.add((object) => {
    const selected = toRaw(selectedObj.value);
    if (!selected) return;
    const { material } = object;
    console.log(object)
    formData.value = material.clone();
    formData.value.uuid = material.uuid;
    formData.value.userData = JSON.stringify(material.userData);
    if (material.color !== undefined) {
      formData.value.color = material.color.clone();
    }
    if (material.specular !== undefined) {
      formData.value.specular = material.specular.clone();
    }
    if (material.emissive !== undefined) {
      formData.value.emissive = material.emissive.clone();
    }
    if (material.attenuationColor !== undefined) {
      formData.value.attenuationColor = material.attenuationColor.clone();
    }
  });
};

export const useMaterial = () => {
  return { formData, materialType, selectedObj, updateUI, change, registerEvent };
};

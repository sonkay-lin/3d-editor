import { materialClasses, vertexShaderVariables } from './MaterialParameters';
import { getEditor } from '@/hooks/useEditor';
import { computed, nextTick, ref, toRaw } from 'vue';
import {
  SetMaterialCommand,
  SetMaterialValueCommand,
  SetMaterialColorCommand,
  SetMaterialVectorCommand
} from '@/utils/commands/Commands';
import { isShowMaterialOrGeometry } from '@/libs';

let editor;
const key = ref(0);
// 选中的物体
const selectedObj = ref(null);
// 表单
const formData = ref({});
// 材质列表
const materialList = ref([]);
// 当前选中的材质
const currentMaterial = ref(0);
// 新增的材质
const newMaterial = ref('MeshBasicMaterial');
// 材质类型
const materialType = computed(() => {
  if (!selectedObj.value) return '';
  const { material = {} } = selectedObj.value;
  return material.type;
});

const selectedMaterial = (index) => {
  currentMaterial.value = index;
  key.value++;
  formData.value = materialList.value[index].clone();
  formData.value.uuid = materialList.value[index].uuid;
  formData.value.userData = JSON.stringify(materialList.value[index].userData);
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

    if (Array.isArray(material)) {
      materialList.value = material;
      currentMaterial.value = 0;
      formData.value = material[0].clone();
      formData.value.uuid = material[0].uuid;
      formData.value.userData = JSON.stringify(material[0].userData);
    } else {
      materialList.value = [material];
      currentMaterial.value = 0;
      formData.value = material.clone();
      formData.value.uuid = material.uuid;
      formData.value.userData = JSON.stringify(material.userData);
    }
  });
  editor.event.materialChanged.add((object) => {
    const selected = toRaw(selectedObj.value);
    if (!selected) return;
    let { material } = object;
    console.log(object);
    if (Array.isArray(material)) {
      material = material[currentMaterial.value];
    }
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
  return {
    formData,
    materialType,
    selectedObj,
    currentMaterial,
    materialList,
    newMaterial,
    key,
    change,
    selectedMaterial,
    registerEvent
  };
};

const change = (params) => {
  try {
    const object = toRaw(selectedObj.value);
    const slot = currentMaterial.value;
    commands[params]?.(object, slot);
  } catch (error) {
    console.error(error);
  }
};

const commands = {
  type: (object, slot) => {
    const { type } = formData.value;
    const newMaterial = new materialClasses[type]();
    if (newMaterial.type === 'RawShaderMaterial') {
      newMaterial.vertexShader = vertexShaderVariables + newMaterial.vertexShader;
    }
    formData.value = newMaterial;
    key.value++;
    formData.value.userData = JSON.stringify(newMaterial.userData);
    let removeMaterial = object.material
    if (Array.isArray(object.material)) {
      removeMaterial = object.material[slot]
    }
    editor.removeMaterial(removeMaterial);
    editor.execute(new SetMaterialCommand(object, newMaterial, slot), `修改材质类型`);
    editor.addMaterial(newMaterial);
  },
  name: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'name', formData.value.name, slot));
  },
  color: (object, slot) => {
    const color = formData.value.color.clone();
    editor.execute(new SetMaterialColorCommand(object, 'color', color, slot));
  },
  size: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'size', formData.value.size, slot));
  },
  reflectivity: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'reflectivity', formData.value.reflectivity, slot));
  },
  emissive: (object, slot) => {
    const color = formData.value.emissive.clone();
    editor.execute(new SetMaterialColorCommand(object, 'emissive', color, slot));
  },
  emissiveIntensity: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'emissiveIntensity', formData.value.emissiveIntensity, slot));
  },
  specular: (object, slot) => {
    const color = formData.value.specular.clone();
    editor.execute(new SetMaterialColorCommand(object, 'specular', color, slot));
  },
  shininess: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'shininess', formData.value.shininess, slot));
  },
  reflectivity: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'reflectivity', formData.value.reflectivity, slot));
  },
  roughness: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'roughness', formData.value.roughness, slot));
  },
  metalness: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'metalness', formData.value.metalness, slot));
  },
  clearcoat: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'clearcoat', formData.value.clearcoat, slot));
  },
  clearcoatRoughness: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'clearcoatRoughness', formData.value.clearcoatRoughness, slot));
  },
  iridescence: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'iridescence', formData.value.iridescence, slot));
  },
  sheen: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'sheen', formData.value.sheen, slot));
  },
  sheenRoughness: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'sheenRoughness', formData.value.sheenRoughness, slot));
  },
  transmission: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'transmission', formData.value.transmission, slot));
  },
  attenuationDistance: (object, slot) => {
    editor.execute(
      new SetMaterialValueCommand(object, 'attenuationDistance', formData.value.attenuationDistance, slot)
    );
  },
  attenuationColor: (object, slot) => {
    const color = formData.value.attenuationColor.clone();
    editor.execute(new SetMaterialColorCommand(object, 'attenuationColor', color, slot));
  },
  thickness: (object, slot) => {
    editor.execute(new SetMaterialColorCommand(object, 'thickness', formData.value.thickness, slot));
  },
  vertexColors: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'vertexColors', formData.value.vertexColors, slot));
  },
  depthPacking: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'depthPacking', formData.value.depthPacking, slot));
  },
  sizeAttenuation: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'sizeAttenuation', formData.value.sizeAttenuation, slot));
  },

  aoMapIntensity: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'aoMapIntensity', formData.value.aoMapIntensity, slot));
  },
  bumpScale: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'bumpScale', formData.value.bumpScale, slot));
  },
  displacementScale: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'displacementScale', formData.value.displacementScale, slot));
  },

  normalScale: (object, slot) => {
    const normalScale = formData.value.normalScale.clone();
    editor.execute(new SetMaterialVectorCommand(object, 'normalScale', normalScale, slot));
  },
  clearcoatNormalScale: (object, slot) => {
    const clearcoatNormalScale = formData.value.clearcoatNormalScale.clone();
    editor.execute(new SetMaterialVectorCommand(object, 'clearcoatNormalScale', clearcoatNormalScale, slot));
  },

  iridescenceThicknessRange: (object, slot) => {
    editor.execute(
      new SetMaterialValueCommand(object, 'iridescenceThicknessRange', formData.value.iridescenceThicknessRange, slot)
    );
  },

  blending: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'blending', formData.value.blending, slot));
  },
  side: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'side', formData.value.side, slot));
  },
  flatShading: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'flatShading', formData.value.flatShading, slot));
  },
  opacity: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'opacity', formData.value.opacity, slot));
  },
  transparent: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'transparent', formData.value.transparent, slot));
  },
  alphaTest: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'alphaTest', formData.value.alphaTest, slot));
  },
  forceSinglePass: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'forceSinglePass', formData.value.forceSinglePass, slot));
  },
  depthTest: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'depthTest', formData.value.depthTest, slot));
  },
  depthWrite: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'depthWrite', formData.value.depthWrite, slot));
  },
  wireframe: (object, slot) => {
    editor.execute(new SetMaterialValueCommand(object, 'wireframe', formData.value.wireframe, slot));
  },

  userData: (object, slot) => {
    const userData = JSON.stringify(formData.value.userData);
    editor.execute(new SetMaterialValueCommand(object, 'userData', userData, slot));
  }
};

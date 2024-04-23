import * as THREE from 'three';
import { Selector } from './Viewport.Selector';
import Event, { onEvent, dispatch } from '@/utils/event/index';
import { History as _History } from './History.js';
import { Storage as _Storage } from './Storage.js';
import { Loader } from './file/Loader';
import { resetConfig } from '@/hooks/useConfig';

// 默认相机
const _DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
_DEFAULT_CAMERA.name = '默认相机';
_DEFAULT_CAMERA.position.set(0, 5, 10);
_DEFAULT_CAMERA.lookAt(new THREE.Vector3());
// 视角相机
const { aspect } = _DEFAULT_CAMERA;
const _VIEW_POINT_CAMERA = new THREE.OrthographicCamera(-aspect, aspect);
_VIEW_POINT_CAMERA.name = '场景视角';
_VIEW_POINT_CAMERA.position.set(0, 0, 1000);
_VIEW_POINT_CAMERA.lookAt(new THREE.Vector3(0, 0, 0));

export const MODE = {
  ADD: 'add',
  EDIT: 'edit',
  DEFAULT: 'default'
};

function Editor() {
  this.onEvent = onEvent;
  this.dispatch = dispatch;
  this.event = Event;
  // 选择器
  this.selector = new Selector(this);
  // 选中物体
  this.selected = null;
  // 编辑器模式
  this.mode = MODE.DEFAULT;
  // 相机
  this.camera = _DEFAULT_CAMERA.clone();
  this.viewportCamera = this.camera;
  this.viewportShading = 'default';
  this.viewpointCamera = [];
  // 渲染器
  this.renderer = null;
  // 场景
  this.scene = new THREE.Scene();
  this.scene.name = 'Scene';
  // 这个场景添加外包围盒
  this.sceneHelpers = new THREE.Scene();

  this.history = new _History(this);
  this.storage = new _Storage();
  this.loader = new Loader(this);

  // 映射表
  this.object = {};
  this.geometries = {};
  this.materials = {};
  this.textures = {};
  this.scripts = {};
  // 收集材质
  this.materialsRefCounter = new Map();

  // 辅助线
  this.helpers = {};
  this.cameras = {};

  this.mixer = new THREE.AnimationMixer(this.scene);

  const viewpoint = _VIEW_POINT_CAMERA.clone();
  this.addCamera(this.camera);
  this.addCamera(viewpoint);
  this.viewpointCamera.push(this.camera);
  this.viewpointCamera.push(viewpoint);
}

Editor.prototype = {
  createRenderer: function (option = {}) {
    const { antialias = true, shadowMap, toneMapping } = option;
    this.renderer = new THREE.WebGLRenderer({ antialias });
    // 如果设置开启，允许在场景中使用阴影贴图 默认是 false
    this.renderer.shadowMap.enabled = shadowMap.enabled;
    // TODO
    // 定义阴影贴图类型 (未过滤, 关闭部分过滤, 关闭部分双线性过滤)
    this.renderer.shadowMap.type = parseFloat(shadowMap.type);
    // 色调映射
    this.renderer.toneMapping = parseFloat(toneMapping);
    // 色调映射的曝光级别。默认是1
    // this.renderer.toneMappingExposure = toneMappingExposure;
    dispatch.rendererCreated(this.renderer);
    dispatch.rendererUpdated();
  },
  setScene: function (scene) {
    this.scene.uuid = scene.uuid;
    this.scene.name = scene.name;
    this.scene.background = scene.background;
    this.scene.environment = scene.environment;
    this.scene.fog = scene.fog;
    this.scene.backgroundBlurriness = scene.backgroundBlurriness;
    this.scene.backgroundIntensity = scene.backgroundIntensity;
    this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

    // this.signals.sceneGraphChanged.active = false;
    while (scene.children.length > 0) {
      this.addObject(scene.children[0]);
    }
    // this.signals.sceneGraphChanged.active = true;
    this.dispatch.refreshSenceUI();
  },
  /**
   * @description 添加物体
   * @param object 被添加的物体
   * @param parent 是否有父节点，否则就从场景添加
   * @param index
   */
  addObject: function (object, parent, index) {
    object.traverse((child) => {
      if (child.geometry !== undefined) this.addGeometry(child.geometry);
      if (child.material !== undefined) this.addMaterial(child.material);

      this.addCamera(child);
      this.addHelper(child);
    });

    if (parent === undefined) {
      this.scene.add(object);
    } else {
      parent.children.splice(index, 0, object);
      object.parent = parent;
    }
    this.dispatch.objectAdded(object);
    this.dispatch.sceneGraphChanged();
  },
  // ui移动对象
  moveObject: function (object, parent, before) {
    if (parent === undefined) {
      parent = this.scene;
    }
    parent.add(object);
    // sort children array
    if (before !== undefined) {
      let index = parent.children.indexOf(before);
      parent.children.splice(index, 0, object);
      parent.children.pop();
    }
    this.dispatch.sceneGraphChanged();
  },
  nameObject: function (object, name) {
    object.name = name;
    this.dispatch.sceneGraphChanged();
  },
  // 删除对象
  removeObject: function (object) {
    if (object.parent === null) return; // avoid deleting the camera or scene
    let scope = this;
    object.traverse((child) => {
      scope.removeCamera(child);
      scope.removeHelper(child);
      if (child.material !== undefined) scope.removeMaterial(child.material);
    });
    object.parent.remove(object);
    this.dispatch.objectRemoved(object);
    this.dispatch.sceneGraphChanged();
  },
  // 添加相机
  addCamera: function (camera) {
    if (camera.isCamera) {
      this.cameras[camera.uuid] = camera;
      this.dispatch.cameraAdded(camera);
    }
  },
  // 移除相机
  removeCamera: function (camera) {
    if (this.cameras[camera.uuid] !== undefined) {
      delete this.cameras[camera.uuid];
      this.dispatch.cameraRemoved(camera);
    }
  },
  // 添加辅助线
  addHelper: (function () {
    let geometry = new THREE.SphereGeometry(2, 4, 2);
    let material = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });
    return function (object, helper) {
      if (helper === undefined) {
        if (object.isCamera) {
          helper = new THREE.CameraHelper(object);
        } else if (object.isPointLight) {
          helper = new THREE.PointLightHelper(object, 1);
        } else if (object.isDirectionalLight) {
          helper = new THREE.DirectionalLightHelper(object, 1);
        } else if (object.isSpotLight) {
          helper = new THREE.SpotLightHelper(object);
        } else if (object.isHemisphereLight) {
          helper = new THREE.HemisphereLightHelper(object, 1);
        } else if (object.isSkinnedMesh) {
          helper = new THREE.SkeletonHelper(object.skeleton.bones[0]);
        } else if (object.isBone === true && object.parent && object.parent.isBone !== true) {
          helper = new THREE.SkeletonHelper(object);
        } else {
          // no helper for this object type
          return;
        }
        const picker = new THREE.Mesh(geometry, material);
        picker.name = 'picker';
        picker.userData.object = object;
        helper.add(picker);
      }
      this.sceneHelpers.add(helper);
      this.helpers[object.id] = helper;

      this.dispatch.helperAdded(helper);
    };
  })(),
  // 移除辅助对象
  removeHelper: function (object) {
    if (this.helpers[object.id] !== undefined) {
      let helper = this.helpers[object.id];
      helper.parent.remove(helper);
      delete this.helpers[object.id];
      this.dispatch.helperRemoved(helper);
    }
  },
  // 添加几何
  addGeometry: function (geometry) {
    this.geometries[geometry.uuid] = geometry;
  },
  // 修改几何名称
  setGeometryName: function (geometry, name) {
    geometry.name = name;
    this.dispatch.sceneGraphChanged();
  },
  // 根据id获取材质
  getMaterialById: function (id) {
    let material;
    let materials = Object.values(this.materials);
    for (let i = 0; i < materials.length; i++) {
      if (materials[i].id === id) {
        material = materials[i];
        break;
      }
    }
    return material;
  },
  // 获取对象里的材质 slot为多材质
  getObjectMaterial: function (object, slot) {
    let material = object.material;
    if (Array.isArray(material) && slot !== undefined) {
      material = material[slot];
    }
    return material;
  },
  // 设置对象材质，可设置多种材质
  setObjectMaterial: function (object, slot, newMaterial) {
    if (Array.isArray(object.material) && slot !== undefined) {
      object.material[slot] = newMaterial;
    } else {
      object.material = newMaterial;
    }
  },
  // 添加材质
  addMaterial: function (material) {
    if (Array.isArray(material)) {
      for (let i = 0, l = material.length; i < l; i++) {
        this.addMaterialToRefCounter(material[i]);
      }
    } else {
      this.addMaterialToRefCounter(material);
    }
    this.dispatch.materialAdded();
  },
  // 将材质添加到映射表里，并设置被引用的次数
  addMaterialToRefCounter: function (material) {
    let materialsRefCounter = this.materialsRefCounter;
    let count = materialsRefCounter.get(material);
    if (count === undefined) {
      materialsRefCounter.set(material, 1);
      this.materials[material.uuid] = material;
    } else {
      count++;
      materialsRefCounter.set(material, count);
    }
  },
  // 设置材质名称
  setMaterialName: function (material, name) {
    material.name = name;
    this.signals.sceneGraphChanged.dispatch();
  },
  // 添加材质
  addTexture: function (texture) {
    this.textures[texture.uuid] = texture;
  },
  // 移除材质
  removeMaterial: function (material) {
    if (Array.isArray(material)) {
      for (let i = 0, l = material.length; i < l; i++) {
        this.removeMaterialFromRefCounter(material[i]);
      }
    } else {
      this.removeMaterialFromRefCounter(material);
    }
    this.dispatch.materialRemoved();
  },
  // 移除映射表里的材质
  removeMaterialFromRefCounter: function (material) {
    let materialsRefCounter = this.materialsRefCounter;
    let count = materialsRefCounter.get(material);
    count--;
    if (count === 0) {
      materialsRefCounter.delete(material);
      delete this.materials[material.uuid];
    } else {
      materialsRefCounter.set(material, count);
    }
  },
  objectByUuid: function (uuid) {
    return this.scene.getObjectByProperty('uuid', uuid, true);
  },

  // 操作
  // 选择物体
  select: function (object) {
    this.selector.select(object);
  },
  // 取消选择
  deselect: function () {
    this.selector.deselect();
  },
  // 聚焦到物体上
  focus: function (object) {
    if (object !== undefined) {
      this.dispatch.objectFocused(object);
    }
  },
  focusById: function (id) {
    this.focus(this.scene.getObjectById(id));
  },

  selectById: function (id) {
    if (id === this.camera.id) {
      this.select(this.camera);
      return;
    }
    this.select(this.scene.getObjectById(id));
  },
  selectByUuid: function (uuid) {
    let scope = this;
    this.scene.traverse((child) => {
      if (child.uuid === uuid) {
        scope.select(child);
      }
    });
  },

  // 设置
  setViewportCamera: function (uuid) {
    this.viewportCamera = this.cameras[uuid];
    this.dispatch.viewportCameraChanged();
  },
  setViewportShading: function (value) {
    this.viewportShading = value;
    this.dispatch.viewportShadingChanged();
  },

  // 执行命令
  execute: function (cmd, optionalName) {
    this.history.execute(cmd, optionalName);
  },
  // 撤销
  undo: function () {
    this.history.undo();
  },
  // 重做
  redo: function () {
    this.history.redo();
  },

  fromJSON: async function (json) {
    let loader = new THREE.ObjectLoader();
    let camera = await loader.parseAsync(json.camera);

    this.camera.copy(camera);
    this.dispatch.cameraResetted();

    this.history.fromJSON(json.history);
    this.scripts = json.scripts;

    this.setScene(await loader.parseAsync(json.scene));

    if (json.environment === 'ModelViewer') {
      // TODO
      // this.signals.sceneEnvironmentChanged.dispatch(json.environment);
    }
  },
  toJSON: function () {
    // scripts clean up
    let scene = this.scene;
    let scripts = this.scripts;
    for (let key in scripts) {
      let script = scripts[key];
      if (script.length === 0 || scene.getObjectByProperty('uuid', key) === undefined) {
        delete scripts[key];
      }
    }
    // honor modelviewer environment
    let environment = null;
    if (this.scene.environment !== null && this.scene.environment.isRenderTargetTexture === true) {
      environment = 'ModelViewer';
    }
    return {
      metadata: {},
      project: {
        // shadows: this.config.getKey( 'project/renderer/shadows' ),
        // shadowType: this.config.getKey( 'project/renderer/shadowType' ),
        // vr: this.config.getKey( 'project/vr' ),
        // toneMapping: this.config.getKey( 'project/renderer/toneMapping' ),
        // toneMappingExposure: this.config.getKey( 'project/renderer/toneMappingExposure' )
      },
      camera: this.viewportCamera.toJSON(),
      scene: this.scene.toJSON(),
      scripts: this.scripts,
      history: this.history.toJSON(),
      environment: environment
    };
  },
  clear: function () {
    this.history.clear();
    this.storage.clear();

    this.camera.copy(_DEFAULT_CAMERA);
    this.dispatch.cameraResetted();

    this.scene.name = 'Scene';
    this.scene.userData = {};
    this.scene.background = null;
    this.scene.environment = null;
    this.scene.fog = null;

    let objects = this.scene.children;

    resetConfig()

    // this.signals.sceneGraphChanged.active = false;

    while (objects.length > 0) {
      this.removeObject(objects[0]);
    }

    // this.signals.sceneGraphChanged.active = true;

    this.geometries = {};
    this.materials = {};
    this.textures = {};
    this.scripts = {};

    this.materialsRefCounter.clear();

    this.animations = {};
    this.mixer.stopAllAction();

    this.deselect();

    this.dispatch.editorCleared();
  }
};

export { Editor };
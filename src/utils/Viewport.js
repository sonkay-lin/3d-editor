import * as THREE from 'three';
import { EditorControls } from './EditorControls';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OrbitControls } from '@/libs/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { ViewportPathtracer } from './Viewport.Pathtracer.js';
import { SetPositionCommand, SetRotationCommand, SetScaleCommand } from './commands/Commands';
import { useViewport } from '@/hooks/useViewport';
import { globalConfig, sceneConfig } from '@/hooks/useConfig';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useTool } from '@/hooks/useTool';
import { mouseInteraction } from './Viewport.MouseInteractions';
import { MODE } from './Editor';
import { ElMessage } from 'element-plus';

/**
 * @description Viewport 添加dom操作和事件
 */
export default function Viewport(editor) {
  const dom = document.getElementById('viewport');

  let renderer = null;
  // 用于从立方体贴图环境纹理生成预过滤
  let pmremGenerator = null;
  // 可以产生非常逼真的反射、折射和阴影效果。
  let pathtracer = null;

  const { camera, scene, sceneHelpers, event } = editor;

  // 选中物体时的外包围盒
  const box = new THREE.Box3();
  const selectionBox = new THREE.Box3Helper(box);
  selectionBox.material.depthTest = false;
  selectionBox.material.transparent = true;
  selectionBox.visible = false;
  sceneHelpers.add(selectionBox);

  let objectPositionOnDown = null;
  let objectRotationOnDown = null;
  let objectScaleOnDown = null;

  // 辅助线
  const grid = new THREE.Group();
  const grid1 = new THREE.GridHelper(150, 150, 0x888888);
  grid1.material.color.setHex(0x888888);
  grid1.material.vertexColors = false;
  grid.add(grid1);
  const grid2 = new THREE.GridHelper(150, 30, 0x222222);
  grid2.material.color.setHex(0x222222);
  grid2.material.vertexColors = false;
  grid.add(grid2);

  const axesHelper = new THREE.AxesHelper(75);
  // sceneHelpers.add( axesHelper );

  // 剖切模型的平面
  const planes = [
    new THREE.Plane(new THREE.Vector3(1, 0, 0), box.min.x),
    new THREE.Plane(new THREE.Vector3(0, 1, 0), box.min.y),
    new THREE.Plane(new THREE.Vector3(0, 0, 1), box.min.z),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), box.max.x),
    new THREE.Plane(new THREE.Vector3(0, -1, 0), box.max.y),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), box.max.z)
  ];

  // 地面，用来给模型投射放置在网格上
  const geometry = new THREE.PlaneGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);
  const Plane = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
  Plane.visible = false;
  sceneHelpers.add(Plane);

  let controls = null;
  controls = setControl();
  let transformControls = null;
  transformControls = setTransformControls();

  // 轨道控制器
  function setControl() {
    controls && controls.dispose();
    const { camera } = editor;
    // const newControls = new EditorControls(camera, dom);
    const newControls = new OrbitControls(camera, dom);
    newControls.addEventListener('change', function () {
      event.cameraChanged.dispatch(newControls.camera);
      // event.refreshSidebarObject3D.dispatch( camera );
    });
    return newControls;
  }
  // 改变控制器
  function setTransformControls() {
    const { camera } = editor;
    transformControls = new TransformControls(camera, dom);
    transformControls.addEventListener('change', () => {
      const { object, axis } = transformControls;
      const transformMode = transformControls.getMode();
      if (object !== undefined) {
        if (transformControls.dragging) {
          // 如果开启吸附
          if (transformMode === 'translate' && globalConfig.isAdsorption) {
            if (axis.includes('X')) {
              object.position.x = parseInt(object.position.x) + 0.5;
            }
            if (axis.includes('Y')) {
              object.position.y = parseInt(object.position.y) + 0.5;
            }
            if (axis.includes('Z')) {
              object.position.z = parseInt(object.position.z) + 0.5;
            }
          }
          // 如果是剖切，则移动平面
          if (editor.mode === MODE.CLIPPING) {
            planes[0].constant = box.min.x > 0 ? -box.min.x : Math.abs(box.min.x);
            planes[1].constant = box.min.y > 0 ? -box.min.y : Math.abs(box.min.y);
            planes[2].constant = box.min.z > 0 ? -box.min.z : Math.abs(box.min.z);
            planes[3].constant = box.max.x;
            planes[4].constant = box.max.y;
            planes[5].constant = box.max.z;
          }
        }
        box.setFromObject(object, true);
        const helper = editor.helpers[object.id];
        if (helper !== undefined && helper.isSkeletonHelper !== true) {
          helper.update();
        }
        event.refreshSidebarObject3D.dispatch(object);
      }

      render(true);
    });
    transformControls.addEventListener('mouseDown', () => {
      const object = transformControls.object;
      objectPositionOnDown = object.position.clone();
      objectRotationOnDown = object.rotation.clone();
      objectScaleOnDown = object.scale.clone();
      controls.enabled = false;
    });
    transformControls.addEventListener('mouseUp', () => {
      const object = transformControls.object;
      if (object !== undefined) {
        switch (transformControls.getMode()) {
          case 'translate':
            if (!objectPositionOnDown.equals(object.position)) {
              editor.execute(new SetPositionCommand(object, object.position, objectPositionOnDown));
            }
            break;

          case 'rotate':
            if (!objectRotationOnDown.equals(object.rotation)) {
              editor.execute(new SetRotationCommand(object, object.rotation, objectRotationOnDown));
            }
            break;

          case 'scale':
            if (!objectScaleOnDown.equals(object.scale)) {
              editor.execute(new SetScaleCommand(object, object.scale, objectScaleOnDown));
            }
            break;
        }
      }

      controls.enabled = true;
    });
    sceneHelpers.add(transformControls);
    return transformControls;
  };
  // TODO 右下角控件
  // viewHelper.center = controls.center;

  // 对象拾取
  const { addStart, cancelAdd } = mouseInteraction({ editor, dom, plane: Plane, controls, transformControls });
  useViewport({ controls, transformControls, useClipping, addStart, cancelAdd, render });

  // 裁切物体
  function useClipping () {
    const { selected: object } = editor;

    if (!object) {
      ElMessage.warning('请选择要进行剖切的模型');
      return;
    }
    if (object.isLight || object.isCamera) {
      ElMessage.warning('灯光和相机无法进行剖切');
      return;
    }
    ElMessage.success('移动包围盒进行剖切');

    editor.mode = MODE.CLIPPING;
    editor.event.objectSelected.dispatch(null);
    renderer.localClippingEnabled = true;

    box.setFromObject(object, true);
    if (box.isEmpty() === false) {
      selectionBox.visible = true;
    }

    const center = box.getCenter(new THREE.Vector3(0, 0, 0));
    const width = box.max.x - box.min.x;
    const height = box.max.y - box.min.y;
    const depth = box.max.z - box.min.z;
    const boxSize = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(boxSize, new THREE.MeshBasicMaterial({ visible: false }));
    mesh.position.copy(center);

    object.traverse((child) => {
      if (child.material) {
        let material = child.material;
        material.clippingPlanes = planes;
        material.clipShadows = true;
        // alphaToCoverage是一种提高透明度物体边缘质量的有效技术
        material.alphaToCoverage = true;
      }
    });
    planes[0].constant = box.min.x > 0 ? -box.min.x : Math.abs(box.min.x);
    planes[1].constant = box.min.y > 0 ? -box.min.y : Math.abs(box.min.y);
    planes[2].constant = box.min.z > 0 ? -box.min.z : Math.abs(box.min.z);
    planes[3].constant = box.max.x;
    planes[4].constant = box.max.y;
    planes[5].constant = box.max.z;

    // TODO: remove mesh
    sceneHelpers.add(mesh);
    transformControls.attach(mesh);
    render();
  };

  // 事件
  (() => {
    // 对象修改
    event.objectChanged.add((object) => {
      if (editor.selected === object) {
        box.setFromObject(object, true);
      }
      if (object.isPerspectiveCamera) {
        object.updateProjectionMatrix();
      }
      const helper = editor.helpers[object.id];
      if (helper !== undefined && helper.isSkeletonHelper !== true) {
        helper.update();
      }
      render(false, 'objectChanged');
    });
    // 对象选中渲染包围盒
    event.objectSelected.add((object) => {
      console.log(object);
      selectionBox.visible = false;
      transformControls.detach();
      if (object !== null && object !== scene && object !== camera) {
        box.setFromObject(object, true);
        if (box.isEmpty() === false) {
          selectionBox.visible = true;
        }
        transformControls.attach(object);
      }
      render();
    });

    // 聚焦到对象
    // event.objectFocused.add((object) => controls.focus(object));
    // 对象移除事件
    event.objectRemoved.add((object) => {
      controls.enabled = true;
      if (object === transformControls.object) {
        transformControls.detach();
        selectionBox.visible = false;
        editor.select(null);
      }
    });
    // 改变场景中当前的相机
    event.viewportCameraChanged.add(() => {
      const { viewportCamera } = editor;
      // 轨道控制器切换相机需要重新创建，获取原先的enabled创建后重新设置
      controls = setControl();
      transformControls.camera = viewportCamera;
      if (viewportCamera.isPerspectiveCamera) {
        viewportCamera.aspect = editor.camera.aspect;
        viewportCamera.projectionMatrix.copy(editor.camera.projectionMatrix);
        controls.enableRotate = true;
      } else if (viewportCamera.isOrthographicCamera) {
        // 如果是正视图等，不让相机旋转
        if (viewportCamera === editor.camera) {
          viewportCamera.left = -dom.offsetWidth / dom.offsetHeight;
          viewportCamera.right = dom.offsetWidth / dom.offsetHeight;
          controls.enableRotate = false;
        }
      }
      // 新增情况下不让鼠标左键和右键
      if (editor.mode === editor.ADD) {
        controls.enableRotate = false;
        controls.enablePan = false;
      }
      controls.enabled = viewportCamera === editor.camera;
      updateAspectRatio();
      render();
    });
    // 相机改变触发的事件
    event.cameraChanged.add(() => {
      pathtracer.reset();
      render();
    });
    // 相机重新设置事件
    event.cameraResetted.add(() => updateAspectRatio());
    // 材质修改事件
    event.materialChanged.add(() => render());
    // 几何修改事件
    event.geometryChanged.add((object) => {
      if (object !== undefined) {
        box.setFromObject(object, true);
      }
      render();
    });
    // 是否显示网格
    event.showGridChanged.add((value) => {
      grid.visible = value;
      render(false, 'showGridChanged');
    });
    // 是否显示辅助线
    event.showHelpersChanged.add((value) => {
      sceneHelpers.visible = value;
      transformControls.enabled = value;
      render(true, 'showHelpersChanged');
    });
    // 更新场景
    event.sceneGraphChanged.add(() => render(false, 'sceneGraphChanged'));
    // 页面尺寸改变
    event.windowResize.add(() => {
      updateAspectRatio();
      renderer.setSize(dom.offsetWidth, dom.offsetHeight);
      pathtracer.setSize(dom.offsetWidth, dom.offsetHeight);
      render(false, 'windowResize');
    });
    // 渲染器创建完成事件
    event.rendererCreated.add((newRenderer) => {
      if (renderer !== null) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
        pmremGenerator.dispose();
        dom.removeChild(renderer.domElement);
      }
      renderer = newRenderer;
      // renderer.setAnimationLoop( animate );
      renderer.setClearColor(0xaaaaaa);
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function (event) {
          renderer.setClearColor(event.matches ? 0x333333 : 0xaaaaaa);
          updateGridColors(grid1, grid2, event.matches ? [0x222222, 0x888888] : [0x888888, 0x282828]);
          render(false, 'mediaQuery');
        });
        renderer.setClearColor(mediaQuery.matches ? 0x333333 : 0xaaaaaa);
        updateGridColors(grid1, grid2, mediaQuery.matches ? [0x222222, 0x888888] : [0x888888, 0x282828]);
      }
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(dom.offsetWidth, dom.offsetHeight);

      pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      pathtracer = new ViewportPathtracer(renderer);

      dom.appendChild(renderer.domElement);
      render(false, 'rendererCreated');
    });
    // 更新渲染器
    event.rendererUpdated.add(() => {
      scene.traverse((child) => {
        if (child.material !== undefined) {
          child.material.needsUpdate = true;
        }
      });
      render(false, 'rendererUpdated');
    });
    // 对象控制器模式修改
    event.transformModeChanged.add((mode) => {
      transformControls.setMode(mode);
    });
    event.rendererDetectKTX2Support.add((ktx2Loader) => {
      ktx2Loader.detectSupport(renderer);
    });
    event.sceneEnvironmentChanged.add(() => {
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    });
  })();

  // window 事件
  (() => {
    // 键盘事件
    const registerKeyboard = (e) => {
      const { ctrlKey, key } = e;
      const _key = key.toLowerCase();
      if (!ctrlKey) return;
      // 保存
      if (_key === 's') {
        e.preventDefault();
        const { save } = useTool();
        save(sceneConfig);
      }
      // 撤销
      if (_key === 'z') {
        e.preventDefault();
        editor.undo();
      }
      // 重做
      if (_key === 'y') {
        e.preventDefault();
        editor.redo();
      }
    };
    window.addEventListener('resize', () => event.windowResize.dispatch());
    window.addEventListener('keydown', registerKeyboard);
  })();

  // 更新像素比
  function updateAspectRatio() {
    const { camera } = editor;
    camera.aspect = dom.offsetWidth / dom.offsetHeight;
    camera.updateProjectionMatrix();
  }

  // 监听渲染性能
  let startTime = 0;
  let endTime = 0;
  function render(isHelper = false, where) {
    // console.log('render', where);
    const { camera, viewportCamera } = editor;
    if (editor.viewportShading === 'realistic' && isHelper === false) {
      pathtracer.init(scene, camera);
    }

    startTime = performance.now();

    renderer.setViewport(0, 0, dom.offsetWidth, dom.offsetHeight);
    renderer.render(scene, viewportCamera);
    if (camera === viewportCamera) {
      renderer.autoClear = false;
      if (globalConfig.isShowGrid) renderer.render(grid, camera);
      if (globalConfig.isShowAxis) renderer.render(axesHelper, camera);
      if (sceneHelpers.visible === true) renderer.render(sceneHelpers, camera);
      // if (vr.currentSession === null) viewHelper.render(renderer);
      renderer.autoClear = true;
    }

    endTime = performance.now();
    // 显示渲染耗时
    // editor.signals.sceneRendered.dispatch(endTime - startTime);
  }
}

function updateGridColors(grid1, grid2, colors) {
  grid1.material.color.setHex(colors[0]);
  grid2.material.color.setHex(colors[1]);
}

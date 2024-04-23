import * as THREE from 'three';
import { EditorControls } from './EditorControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { ViewportPathtracer } from './Viewport.Pathtracer.js';
import { SetPositionCommand, SetRotationCommand, SetScaleCommand } from './commands/Commands';
import { useViewport } from '@/hooks/useViewport';
import { globalConfig, sceneConfig } from '@/hooks/useConfig';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useTool } from '@/hooks/useTool';

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

  const { camera, scene, sceneHelpers, onEvent, dispatch } = editor;

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

  const geometry = new THREE.PlaneGeometry(1000, 1000);
  geometry.rotateX(-Math.PI / 2);
  const Plane = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
  Plane.visible = false;
  sceneHelpers.add(Plane);

  // editor.isAddMode = true;

  let controls = null;
  controls = setControl();

  // 轨道控制器
  function setControl() {
    controls && controls.dispose();
    const { camera } = editor;
    // const newControls = new EditorControls(camera, dom);
    const newControls = new OrbitControls(camera, dom);
    newControls.addEventListener('change', function () {
      dispatch.cameraChanged(newControls.camera);
      // dispatch.refreshSidebarObject3D( camera );
    });
    return newControls;
  }
  let transformControls = null;
  // 改变控制器
  const setTransformControls = () => {
    const { camera } = editor;
    transformControls = new TransformControls(camera, dom);
    transformControls.addEventListener('change', () => {
      const { object } = transformControls;
      if (object !== undefined) {
        box.setFromObject(object, true);
        const helper = editor.helpers[object.id];
        if (helper !== undefined && helper.isSkeletonHelper !== true) {
          helper.update();
        }
        if (transformControls.dragging) {
          dispatch.refreshSidebarObject3D(object);
        }
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
  transformControls = setTransformControls();
  // TODO 右下角控件
  // viewHelper.center = controls.center;

  // 对象拾取
  usePickerObject(editor, dom, render, Plane, controls);
  useViewport({ controls, transformControls, pmremGenerator, render });

  // 事件
  (() => {
    // 对象修改
    onEvent.objectChanged((object) => {
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
    onEvent.objectSelected((object) => {
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
    onEvent.objectFocused((object) => controls.focus(object));
    // 对象移除事件
    onEvent.objectRemoved((object) => {
      controls.enabled = true;
      if (object === transformControls.object) {
        transformControls.detach();
        selectionBox.visible = false;
        editor.select(null);
      }
    });
    // 改变场景中当前的相机
    onEvent.viewportCameraChanged(() => {
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
      controls.enabled = viewportCamera === editor.camera;
      updateAspectRatio();
      render();
    });
    // 相机改变触发的事件
    onEvent.cameraChanged(() => {
      pathtracer.reset();
      render();
    });
    // 相机重新设置事件
    onEvent.cameraResetted(() => updateAspectRatio());
    // 材质修改事件
    onEvent.materialChanged(() => render(false, 'materialChanged'));
    // 几何修改事件
    onEvent.geometryChanged((object) => {
      if (object !== undefined) {
        box.setFromObject(object, true);
      }
      render(false, 'geometryChanged');
    });
    // 是否显示网格
    onEvent.showGridChanged((value) => {
      grid.visible = value;
      render(false, 'showGridChanged');
    });
    // 是否显示辅助线
    onEvent.showHelpersChanged((value) => {
      sceneHelpers.visible = value;
      transformControls.enabled = value;
      render(true, 'showHelpersChanged');
    });
    // 更新场景
    onEvent.sceneGraphChanged(() => render(false, 'sceneGraphChanged'));
    // 页面尺寸改变
    onEvent.windowResize(() => {
      updateAspectRatio();
      renderer.setSize(dom.offsetWidth, dom.offsetHeight);
      pathtracer.setSize(dom.offsetWidth, dom.offsetHeight);
      render(false, 'windowResize');
    });
    // 渲染器创建完成事件
    onEvent.rendererCreated((newRenderer) => {
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
    onEvent.rendererUpdated(() => {
      scene.traverse((child) => {
        if (child.material !== undefined) {
          child.material.needsUpdate = true;
        }
      });
      render(false, 'rendererUpdated');
    });
    // 对象控制器模式修改
    onEvent.transformModeChanged((mode) => {
      transformControls.setMode(mode);
    });
    onEvent.rendererDetectKTX2Support((ktx2Loader) => {
      ktx2Loader.detectSupport(renderer);
    });
    onEvent.sceneEnvironmentChanged(() => {
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
    window.addEventListener('resize', () => {
      dispatch.windowResize();
    });
    window.addEventListener('keydown', registerKeyboard);
  })();

  // 更新像素
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

const usePickerObject = (editor, dom, render, plane, controls) => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.5, color: 0xffffff });
  const mesh = new THREE.Mesh(geometry, material);

  const { scene, sceneHelpers, dispatch } = editor;
  // 对象拾取--start
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  // 获取相交的对象
  function getIntersects(point) {
    const { camera } = editor;
    mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
    raycaster.setFromCamera(mouse, camera);

    const objects = [];
    scene.traverseVisible((child) => {
      objects.push(child);
    });
    sceneHelpers.traverseVisible((child) => {
      if (child.name === 'picker') objects.push(child);
    });
    if (editor.isAddMode) {
      objects.push(plane);
    }
    return raycaster.intersectObjects(objects, false);
  }
  // 记录鼠标对应的位置
  const onDownPosition = new THREE.Vector2();
  const onUpPosition = new THREE.Vector2();
  const onDoubleClickPosition = new THREE.Vector2();

  const pointer = new THREE.Vector2();
  // 获取鼠标位置
  function getMousePosition(dom, x, y) {
    const rect = dom.getBoundingClientRect();
    return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  }
  // 处理点击
  function handleClick() {
    if (onDownPosition.distanceTo(onUpPosition) === 0) {
      const intersects = getIntersects(onUpPosition);
      // if (editor.isAddMode) {
      //   const intersect = intersects[0];
      //   mesh.position.copy(intersect.point);
      //   mesh.position.divideScalar(1).floor().multiplyScalar(1).addScalar(0.5);
      // } else {
      dispatch.intersectionsDetected(intersects);
      // }
      render();
    }
  }
  // 点击下去
  function onMouseDown(event) {
    const { renderer } = editor;
    // event.preventDefault();
    if (event.target !== renderer.domElement) return;
    const array = getMousePosition(dom, event.clientX, event.clientY);
    onDownPosition.fromArray(array);
    document.addEventListener('mouseup', onMouseUp);

    // sceneHelpers.add();
    // controls.enabled = false;
    // document.addEventListener('mousemove', onMouseMove);
  }
  // 点击松开
  function onMouseUp(event) {
    const array = getMousePosition(dom, event.clientX, event.clientY);
    onUpPosition.fromArray(array);
    handleClick();

    dispatch.sceneGraphChanged();

    document.removeEventListener('mouseup', onMouseUp);
    // document.removeEventListener('mousemove', onMouseMove);
    // controls.enabled = true;
  }
  function onMouseMove(event) {
    const array = getMousePosition(dom, event.clientX, event.clientY);
    pointer.fromArray(array);
    const intersects = getIntersects(pointer);
    if (intersects.length === 0) return;
    const intersect = intersects[0];
    mesh.position.copy(intersect.point); //.add(intersect.face.normal);
    //mesh.position.divideScalar(1).floor().multiplyScalar(1).addScalar(0.5);
    mesh.position.y = Math.abs(mesh.position.y) + 0.5;
    render();
  }
  // 开始触摸
  function onTouchStart(event) {
    const touch = event.changedTouches[0];
    const array = getMousePosition(dom, touch.clientX, touch.clientY);
    onDownPosition.fromArray(array);
    document.addEventListener('touchend', onTouchEnd);
  }
  // 触摸结束
  function onTouchEnd(event) {
    const touch = event.changedTouches[0];
    const array = getMousePosition(dom, touch.clientX, touch.clientY);
    onUpPosition.fromArray(array);
    handleClick();
    document.removeEventListener('touchend', onTouchEnd);
  }
  // 双击
  function onDoubleClick(event) {
    if (editor.isAddMode) return;
    const array = getMousePosition(dom, event.clientX, event.clientY);
    onDoubleClickPosition.fromArray(array);
    const intersects = getIntersects(onDoubleClickPosition);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      dispatch.objectFocused(intersect.object);
    }
  }
  dom.addEventListener('mousedown', onMouseDown);
  dom.addEventListener('touchstart', onTouchStart, { passive: false });
  dom.addEventListener('dblclick', onDoubleClick);
  // 对象拾取--end
};

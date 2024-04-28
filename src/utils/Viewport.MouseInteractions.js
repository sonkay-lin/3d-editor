import { AddObjectCommand } from './commands/Commands';
import { MODE } from './Editor';
import { globalConfig } from '@/hooks/useConfig';
import * as THREE from 'three';

// 鼠标交互事件

export const mouseInteraction = ({ editor, dom, plane, controls, transformControls }) => {
  const { scene, sceneHelpers, event } = editor;
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
    if (editor.mode === MODE.ADD) {
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
      event.intersectionsDetected.dispatch(intersects);
    }
  }
  // 点击下去
  function onMouseDown(e) {
    const { renderer } = editor;
    // e.preventDefault();
    if (e.target !== renderer.domElement) return;
    const array = getMousePosition(dom, e.clientX, e.clientY);
    onDownPosition.fromArray(array);
    document.addEventListener('mouseup', onMouseUp);
  }
  // 点击松开
  function onMouseUp(e) {
    const array = getMousePosition(dom, e.clientX, e.clientY);
    onUpPosition.fromArray(array);
    handleClick();

    event.sceneGraphChanged.dispatch();
    document.removeEventListener('mouseup', onMouseUp);
  }
  // 开始触摸
  function onTouchStart(e) {
    const touch = e.changedTouches[0];
    const array = getMousePosition(dom, touch.clientX, touch.clientY);
    onDownPosition.fromArray(array);
    document.addEventListener('touchend', onTouchEnd);
  }
  // 触摸结束
  function onTouchEnd(e) {
    const touch = e.changedTouches[0];
    const array = getMousePosition(dom, touch.clientX, touch.clientY);
    onUpPosition.fromArray(array);
    handleClick();
    document.removeEventListener('touchend', onTouchEnd);
  }
  // 双击
  function onDoubleClick(e) {
    const array = getMousePosition(dom, e.clientX, e.clientY);
    onDoubleClickPosition.fromArray(array);
    const intersects = getIntersects(onDoubleClickPosition);
    if (intersects.length > 0) {
      const intersect = intersects[0];
      event.objectFocused.dispatch(intersect.object);
    }
  }

  let addObject = null;
  let objectHalfHeight = 0;
  function addStart(object) {
    editor.mode = MODE.ADD;
    transformControls.detach();
    // 如果没有取消，再次点击，就要将影子去掉
    if (addObject) {
      sceneHelpers.remove(addObject);
    }
    addObject = object;
    addObject.position.copy(new THREE.Vector3(0, 0, 0));
    // 将物体设置成透明状态
    if (addObject.material) {
      addObject.material.transparent = true;
      addObject.material.opacity = 0.4;
    }
    // 将几何体放到平面上
    // if (addObject.geometry) {
      const box = new THREE.Box3();
      box.setFromObject(addObject, true);
      objectHalfHeight = Math.abs(box.min.y);
    // }
    sceneHelpers.add(addObject);
    // 轨道控制器禁用左键和右键
    controls.enablePan = false;
    controls.enableRotate = false;
    // 移除选择物体的事件
    removeEventListener();
    // 添加鼠标在场景中点击添加物体的事件
    dom.addEventListener('mousemove', onMouseMove);
    dom.addEventListener('click', onMouseDownAdd);
    document.addEventListener('contextmenu', cancelAdd);
    event.sceneGraphChanged.dispatch();
  }
  function onMouseDownAdd() {
    const object = addObject.clone();
    if (addObject.material) {
      object.material = addObject.material.clone();
      object.material.transparent = false;
      object.material.opacity = 1;
    }
    editor.execute(new AddObjectCommand(object, false));
    event.sceneGraphChanged.dispatch();
  }
  function onMouseMove(e) {
    const array = getMousePosition(dom, e.clientX, e.clientY);
    pointer.fromArray(array);
    const intersects = getIntersects(pointer);
    if (intersects.length === 0) return;
    const intersect = intersects[0];
    addObject.position.copy(intersect.point); //.add(intersect.face.normal);
    addObject.position.y = Math.abs(addObject.position.y);
    // 吸附开启
    if (globalConfig.isAdsorption) {
      addObject.position.divideScalar(1).floor().multiplyScalar(1); //.addScalar(0.5);
      addObject.position.x += 0.5;
      addObject.position.z += 0.5;
    }
    addObject.position.y += objectHalfHeight;
    event.sceneGraphChanged.dispatch();
  }
  function cancelAdd(e) {
    e?.preventDefault();
    editor.mode = MODE.DEFAULT;
    sceneHelpers.remove(addObject);
    addObject = null;
    controls.enableRotate = true;
    controls.enablePan = true;
    dom.removeEventListener('click', onMouseDownAdd);
    dom.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('contextmenu', cancelAdd);
    resetEventListener();
    event.sceneGraphChanged.dispatch();
  }

  function removeEventListener() {
    dom.removeEventListener('mousedown', onMouseDown);
    dom.removeEventListener('touchstart', onTouchStart, { passive: false });
    dom.removeEventListener('dblclick', onDoubleClick);
  }

  function resetEventListener() {
    dom.addEventListener('mousedown', onMouseDown);
    dom.addEventListener('touchstart', onTouchStart, { passive: false });
    dom.addEventListener('dblclick', onDoubleClick);
  }

  // dom.addEventListener('mousedown', onMouseDown);
  // dom.addEventListener('touchstart', onTouchStart, { passive: false });
  // dom.addEventListener('dblclick', onDoubleClick);
  resetEventListener();

  return { addStart, cancelAdd };
};

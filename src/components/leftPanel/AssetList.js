import { ref } from 'vue';

export const object3DList = [
  { key: 'group', img: require('@/assets/object3D/group.png'), name: '组' },
  { key: 'sprite', img: require('@/assets/object3D/sprite.png'), name: '精灵图' },
  { key: 'box', img: require('@/assets/object3D/box.png'), name: '正方体' },
  { key: 'circle', img: require('@/assets/object3D/circle.png'), name: '圆' },
  { key: 'cylinder', img: require('@/assets/object3D/cylinder.png'), name: '圆柱体' },
  { key: 'sphere', img: require('@/assets/object3D/sphere.png'), name: '球体' },
  { key: 'torus', img: require('@/assets/object3D/torus.png'), name: '圆环体' },
  { key: 'plane', img: require('@/assets/object3D/plane.png'), name: '平面' },
  { key: 'ring', img: require('@/assets/object3D/ring.png'), name: '环' },
  { key: 'tetrahedron', img: require('@/assets/object3D/tetrahedron.png'), name: '四面体' },
  { key: 'octahedron', img: require('@/assets/object3D/octahedron.png'), name: '八面体' },
  { key: 'dodecahedron', img: require('@/assets/object3D/dodecahedron.png'), name: '十二面体' },
  { key: 'icosahedron', img: require('@/assets/object3D/icosahedron.png'), name: '二十面体' },
  { key: 'capsule', img: require('@/assets/object3D/capsule.png'), name: '胶囊' },
  { key: 'doubleCone', img: require('@/assets/object3D/doubleCone.png'), name: '双锥' },
  { key: 'torusKnot', img: require('@/assets/object3D/torusKnot.png'), name: '环面扭结体' },
  { key: 'tube', img: require('@/assets/object3D/tube.png'), name: '管' },
  { key: 'teapot', img: require('@/assets/object3D/teapot.png'), name: '茶壶' }
];

export const lightList = [
  { key: 'ambientLight', img: require('@/assets/light/taiyang.png'), name: '环境光' },
  { key: 'directionalLight', img: require('@/assets/light/taiyang.png'), name: '平行光' },
  { key: 'hemisphereLight', img: require('@/assets/light/taiyang.png'), name: '半球光' },
  { key: 'pointLight', img: require('@/assets/light/taiyang.png'), name: '点光源' },
  { key: 'spotlight', img: require('@/assets/light/taiyang.png'), name: '聚光灯' }
];

export const cameraList = [
  { key: 'orthographicCamera', img: require('@/assets/camera/camera.png'), name: '正交相机' },
  { key: 'perspectiveCamera', img: require('@/assets/camera/camera.png'), name: '透视相机' }
];

export const modelList = [
  { key: 'redCar', img: require('@/assets/object3D/box.png'), name: '红色轿车', path: 'red_car.gltf', isLoading: ref(false) },
  { key: 'bus', img: require('@/assets/object3D/box.png'), name: '公交车', path: 'bus1.gltf', isLoading: ref(false) },
  { key: 'wajueji', img: require('@/assets/object3D/box.png'), name: '挖掘机', path: 'wajueji.glb', isLoading: ref(false) },
  // { key: 'cxk', img: require('@/assets/object3D/box.png'), name: '鸡哥', path: 'cxk.glb' },
]
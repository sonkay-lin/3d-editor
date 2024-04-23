import * as THREE from 'three'

export const geometryType = {
  BoxGeometry: [
    'uuid',
    'name',
    'width',
    'height',
    'depth',
    'widthSegments',
    'heightSegments',
    'depthSegments',
    'attributes',
    'bounds'
  ],
  CapsuleGeometry: ['uuid', 'name', 'radius', 'length', 'capSegments', 'radialSegments', 'attributes', 'bounds'],
  CircleGeometry: ['uuid', 'name', 'radius', 'segments', 'thetaStart', 'thetaLength', 'attributes', 'bounds'],
  CylinderGeometry: [
    'uuid',
    'name',
    'radiusTop',
    'radiusBottom',
    'height',
    'radialSegments',
    'heightSegments',
    'openEnded',
    'attributes',
    'bounds'
  ],
  DodecahedronGeometry: ['uuid', 'name', 'radius', 'detail', 'attributes', 'bounds'],
  IcosahedronGeometry: ['uuid', 'name', 'radius', 'detail', 'attributes', 'bounds'],
  LatheGeometry: ['uuid', 'name', 'segments', 'phiStart', 'phiLength', 'points', 'attributes', 'bounds'],
  OctahedronGeometry: ['uuid', 'name', 'radius', 'detail', 'attributes', 'bounds'],
  PlaneGeometry: ['uuid', 'name', 'width', 'height', 'widthSegments', 'heightSegments', 'attributes', 'bounds'],
  RingGeometry: [
    'uuid',
    'name',
    'innerRadius',
    'outerRadius',
    'thetaSegments',
    'phiSegments',
    'thetaStart',
    'thetaLength',
    'attributes',
    'bounds'
  ],
  SphereGeometry: [
    'uuid',
    'name',
    'radius',
    'widthSegments',
    'heightSegments',
    'phiStart',
    'phiLength',
    'thetaStart',
    'thetaLength',
    'attributes',
    'bounds'
  ],
  // 四面体
  TetrahedronGeometry: ['uuid', 'name', 'radius', 'detail', 'attributes', 'bounds'],
  // 圆环
  TorusGeometry: ['uuid', 'name', 'radius', 'tube', 'radialSegments', 'tubularSegments', 'arc', 'attributes', 'bounds'],
  TorusKnotGeometry: [
    'uuid',
    'name',
    'radius',
    'tube',
    'radialSegments',
    'tubularSegments',
    'p',
    'q',
    'attributes',
    'bounds'
  ],
  TubeGeometry: [
    'uuid',
    'name',
    'path',
    'radius',
    'radialSegments',
    'tubularSegments',
    'closed',
    'attributes',
    'bounds'
  ],
  // TeapotGeometry: ['uuid', 'name', 'attributes', 'bounds'],
  BufferGeometry: ['uuid', 'name', 'attributes', 'bounds']
};

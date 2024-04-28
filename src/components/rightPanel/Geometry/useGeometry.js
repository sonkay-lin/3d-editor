import { computed, ref, toRaw } from 'vue';
import { SetGeometryCommand, SetGeometryValueCommand } from '@/utils/commands/Commands';
import { getEditor } from '@/hooks/useEditor';
import * as THREE from 'three';

let editor;
const selectedObj = ref(null);
const formData = ref({});
const _geometryType = computed(() => (selectedObj.value ? selectedObj.value.geometry.type : null));

const change = (param) => {
  const object = toRaw(selectedObj.value);
  const type = _geometryType.value;
  if (!type) return;
  if (param === 'name') {
    command[param](object)
  } else {
    command[type](object);
  }
};

const command = {
  name: (object) => {
    editor.execute(new SetGeometryValueCommand(object, 'name', formData.value.name));
  },
  BoxGeometry: (object) => {
    const { width, height, depth, widthSegments, heightSegments, depthSegments } = formData.value;
    const newGeometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  CapsuleGeometry: (object) => {
    const { radius, length, capSegments, radialSegments } = formData.value;
    const newGeometry = new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  CircleGeometry: (object) => {
    const { radius, segments, thetaStart, thetaLength } = formData.value;
    const newGeometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  CylinderGeometry: (object) => {
    const { radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded } = formData.value;
    const newGeometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments,
      heightSegments,
      openEnded
    );
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  DodecahedronGeometry: (object) => {
    const { radius, detail } = formData.value;
    const newGeometry = new THREE.DodecahedronGeometry(radius, detail);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  IcosahedronGeometry: (object) => {
    const { radius, detail } = formData.value;
    const newGeometry = new THREE.IcosahedronGeometry(radius, detail);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  LatheGeometry: (object) => {
    const { segments, phiStart, phiLength, points } = formData.value;
    const newGeometry = new THREE.LatheGeometry(points, segments, phiStart, phiLength);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  OctahedronGeometry: (object) => {
    const { radius, detail } = formData.value;
    const newGeometry = new THREE.OctahedronGeometry(radius, detail);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  PlaneGeometry: (object) => {
    const { width, height, widthSegments, heightSegments } = formData.value;
    const newGeometry = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  RingGeometry: (object) => {
    const { innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength } = formData.value;
    const newGeometry = new THREE.RingGeometry(
      innerRadius,
      outerRadius,
      thetaSegments,
      phiSegments,
      thetaStart,
      thetaLength
    );
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  SphereGeometry: (object) => {
    const { radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength } = formData.value;
    const newGeometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
      phiStart,
      phiLength,
      thetaStart,
      thetaLength
    );
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  TetrahedronGeometry: (object) => {
    const { radius, detail } = formData.value;
    const newGeometry = new THREE.TetrahedronGeometry(radius, detail);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  TorusGeometry: (object) => {
    const { radius, tube, radialSegments, tubularSegments, arc } = formData.value;
    const newGeometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  TorusKnotGeometry: (object) => {
    const { radius, tube, tubularSegments, radialSegments, p, q } = formData.value;
    const newGeometry = new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  TubeGeometry: (object) => {
    const { path, tubularSegments, radius, radialSegments, closed } = formData.value;
    const newGeometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed);
    editor.execute(new SetGeometryCommand(object, newGeometry));
  },
  BufferGeometry: (object) => {
    const {} = formData.value;
    const newGeometry = new THREE.BufferGeometry();
    editor.execute(new SetGeometryCommand(object, newGeometry));
  }
};

const updateUI = (object) => {
  if (!object || object.geometry === undefined) return;
  formData.value = { ...object.geometry.parameters };
  formData.value.name = object.geometry.name;
  formData.value.uuid = object.geometry.uuid;
};

const registerEvent = () => {
  editor = getEditor();
  editor.event.objectSelected.add((selected) => {
    selectedObj.value = selected;
    updateUI(selected);
  });
  editor.event.geometryChanged.add((selected) => {
    updateUI(selected);
  });
};

export const useGeometry = () => {
  return {
    formData,
    selectedObj,
    _geometryType,
    change,
    registerEvent
  };
};

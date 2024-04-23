<template>
  <span class="texture">
    <input type="file" style="display: none" @change="inputChange" ref="inputRef" />
    <canvas class="canvas" :width="32" :height="16" @click="canvasClick" ref="canvasRef"></canvas>
  </span>
</template>

<script setup>
import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';
import { ref } from 'vue';

const canvasRef = ref(null);
const inputRef = ref(null);
const emits = defineEmits(['change']);

let texture = null;

const canvasClick = () => {
  inputRef.value.click();
};
const inputChange = (event) => {
  loadFile(event.target.files[0]);
};
function loadFile(file) {
  if (!file) return;
  const extension = file.name.split('.').pop().toLowerCase();
  const reader = new FileReader();
  if (extension === 'hdr' || extension === 'pic') {
    reader.onload = async (event) => {
      const loader = new RGBELoader();
      loader.load(event.target.result, (hdrTexture) => {
        hdrTexture.sourceFile = file.name;
        hdrTexture.isHDRTexture = true;
        setValue(hdrTexture);
        emits('change', hdrTexture);
      });
    };
    reader.readAsDataURL(file);
  } else if (extension === 'tga') {
    reader.onload = (event) => {
      const loader = new TGALoader();
      loader.load(event.target.result, (_texture) => {
        _texture.colorSpace = THREE.SRGBColorSpace;
        _texture.sourceFile = file.name;
        setValue(_texture);
        emits('change', _texture);
      });
    };
    reader.readAsDataURL(file);
  } else if (extension === 'ktx2') {
    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const blobURL = URL.createObjectURL(new Blob([arrayBuffer]));
      const ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath('../../examples/jsm/libs/basis/');
      editor.dispatch.rendererDetectKTX2Support(ktx2Loader);
      ktx2Loader.load(blobURL, (_texture) => {
        _texture.colorSpace = THREE.SRGBColorSpace;
        _texture.sourceFile = file.name;
        _texture.needsUpdate = true;
        setValue(_texture);
        ktx2Loader.dispose();
        emits('change', _texture);
      });
    };

    reader.readAsArrayBuffer(file);
  } else if (file.type.match('image.*')) {
    reader.onload = async (event) => {
      const image = new Image();
      image.src = event.target.result;
      image.onload = () => {
        const _texture = new THREE.Texture(image);
        _texture.sourceFile = file.name;
        _texture.needsUpdate = true;
        setValue(_texture);
        emits('change', _texture);
      };
    };

    reader.readAsDataURL(file);
  }
}
const setValue = (_texture) => {
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (_texture !== null) {
    const image = _texture.image;
    if (image !== undefined && image !== null && image.width > 0) {
      canvas.title = _texture.sourceFile;
      const scale = canvas.width / image.width;
      if (_texture.isDataTexture || _texture.isCompressedTexture) {
        const canvas2 = renderToCanvas(_texture);
        context.drawImage(canvas2, 0, 0, image.width * scale, image.height * scale);
      } else {
        context.drawImage(image, 0, 0, image.width * scale, image.height * scale);
      }
    } else {
      canvas.title = _texture.sourceFile + ' (error)';
    }
  } else {
    canvas.title = 'empty';
  }
  texture = _texture;
};
let renderer;
function renderToCanvas(_texture) {
  if (renderer === undefined) {
    renderer = new THREE.WebGLRenderer();
  }

  const image = _texture.image;

  renderer.setSize(image.width, image.height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const material = new THREE.MeshBasicMaterial({ map: _texture });
  const quad = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(quad, material);
  scene.add(mesh);

  renderer.render(scene, camera);

  return renderer.domElement;
}

defineExpose({ texture, setValue });
</script>

<style scoped lang="scss">
.texture {
  height: 16px;
  width: 32px;
  cursor: pointer;
  margin-right: 5px;
  border: 1px solid #888;
}
</style>

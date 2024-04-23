import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader.js';

class UIElement {
  constructor(dom) {
    this.dom = dom;
  }

  add() {
    for (let i = 0; i < arguments.length; i++) {
      const argument = arguments[i];

      if (argument instanceof UIElement) {
        this.dom.appendChild(argument.dom);
      } else {
        console.error('UIElement:', argument, 'is not an instance of UIElement.');
      }
    }

    return this;
  }

  remove() {
    for (let i = 0; i < arguments.length; i++) {
      const argument = arguments[i];

      if (argument instanceof UIElement) {
        this.dom.removeChild(argument.dom);
      } else {
        console.error('UIElement:', argument, 'is not an instance of UIElement.');
      }
    }

    return this;
  }

  clear() {
    while (this.dom.children.length) {
      this.dom.removeChild(this.dom.lastChild);
    }
  }

  setId(id) {
    this.dom.id = id;

    return this;
  }

  getId() {
    return this.dom.id;
  }

  setClass(name) {
    this.dom.className = name;

    return this;
  }

  addClass(name) {
    this.dom.classList.add(name);

    return this;
  }

  removeClass(name) {
    this.dom.classList.remove(name);

    return this;
  }

  setStyle(style, array) {
    for (let i = 0; i < array.length; i++) {
      this.dom.style[style] = array[i];
    }

    return this;
  }

  setDisabled(value) {
    this.dom.disabled = value;

    return this;
  }

  setTextContent(value) {
    this.dom.textContent = value;

    return this;
  }

  setInnerHTML(value) {
    this.dom.innerHTML = value;
  }

  getIndexOfChild(element) {
    return Array.prototype.indexOf.call(this.dom.children, element.dom);
  }
}

class UISpan extends UIElement {
  constructor() {
    super(document.createElement('span'));
  }
}

class UITexture extends UISpan {
  constructor(editor) {
    super();

    const scope = this;
    this.setClass('texture')
    const form = document.createElement('form');

    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', function (event) {
      loadFile(event.target.files[0]);
    });
    form.appendChild(input);

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 16;
    canvas.style.cursor = 'pointer';
    canvas.style.marginRight = '5px';
    canvas.style.border = '1px solid #888';
    canvas.addEventListener('click', function () {
      input.click();
    });
    canvas.addEventListener('drop', function (event) {
      event.preventDefault();
      event.stopPropagation();
      loadFile(event.dataTransfer.files[0]);
    });
    this.dom.appendChild(canvas);

    function loadFile(file) {
      const extension = file.name.split('.').pop().toLowerCase();
      const reader = new FileReader();

      if (extension === 'hdr' || extension === 'pic') {
        reader.addEventListener('load', function (event) {
          // assuming RGBE/Radiance HDR iamge format

          const loader = new RGBELoader();
          loader.load(event.target.result, function (hdrTexture) {
            hdrTexture.sourceFile = file.name;
            hdrTexture.isHDRTexture = true;

            scope.setValue(hdrTexture);

            if (scope.onChangeCallback) scope.onChangeCallback(hdrTexture);
          });
        });

        reader.readAsDataURL(file);
      } else if (extension === 'tga') {
        reader.addEventListener(
          'load',
          function (event) {
            const loader = new TGALoader();
            loader.load(event.target.result, function (texture) {
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.sourceFile = file.name;

              scope.setValue(texture);

              if (scope.onChangeCallback) scope.onChangeCallback(texture);
            });
          },
          false
        );

        reader.readAsDataURL(file);
      } else if (extension === 'ktx2') {
        reader.addEventListener('load', function (event) {
          const arrayBuffer = event.target.result;
          const blobURL = URL.createObjectURL(new Blob([arrayBuffer]));
          const ktx2Loader = new KTX2Loader();
          ktx2Loader.setTranscoderPath('../../examples/jsm/libs/basis/');
          //TODO:
          // editor.signals.rendererDetectKTX2Support.dispatch(ktx2Loader);

          ktx2Loader.load(blobURL, function (texture) {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.sourceFile = file.name;
            texture.needsUpdate = true;
            scope.setValue(texture);

            if (scope.onChangeCallback) scope.onChangeCallback(texture);
            ktx2Loader.dispose();
          });
        });

        reader.readAsArrayBuffer(file);
      } else if (file.type.match('image.*')) {
        reader.addEventListener(
          'load',
          function (event) {
            const image = document.createElement('img');
            image.addEventListener(
              'load',
              function () {
                const texture = new THREE.Texture(this);
                texture.sourceFile = file.name;
                texture.needsUpdate = true;

                scope.setValue(texture);

                if (scope.onChangeCallback) scope.onChangeCallback(texture);
              },
              false
            );

            image.src = event.target.result;
          },
          false
        );

        reader.readAsDataURL(file);
      }

      form.reset();
    }

    this.texture = null;
    this.onChangeCallback = null;
  }

  getValue() {
    return this.texture;
  }

  setValue(texture) {
    const canvas = this.dom.children[0];
    const context = canvas.getContext('2d');

    // Seems like context can be null if the canvas is not visible
    if (context) {
      // Always clear the context before set new texture, because new texture may has transparency
      context.clearRect(0, 0, canvas.width, canvas.height);
    }

    if (texture !== null) {
      const image = texture.image;

      if (image !== undefined && image !== null && image.width > 0) {
        canvas.title = texture.sourceFile;
        const scale = canvas.width / image.width;

        if (texture.isDataTexture || texture.isCompressedTexture) {
          const canvas2 = renderToCanvas(texture);
          context.drawImage(canvas2, 0, 0, image.width * scale, image.height * scale);
        } else {
          context.drawImage(image, 0, 0, image.width * scale, image.height * scale);
        }
      } else {
        canvas.title = texture.sourceFile + ' (error)';
      }
    } else {
      canvas.title = 'empty';
    }

    this.texture = texture;
  }

  setColorSpace(colorSpace) {
    const texture = this.getValue();

    if (texture !== null) {
      texture.colorSpace = colorSpace;
    }

    return this;
  }

  onChange(callback) {
    this.onChangeCallback = callback;

    return this;
  }
}

let renderer;

function renderToCanvas(texture) {
  if (renderer === undefined) {
    renderer = new THREE.WebGLRenderer();
  }

  const image = texture.image;

  renderer.setSize(image.width, image.height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const material = new THREE.MeshBasicMaterial({ map: texture });
  const quad = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(quad, material);
  scene.add(mesh);

  renderer.render(scene, camera);

  return renderer.domElement;
}


export { UITexture }
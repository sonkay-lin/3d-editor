export function Player() {
  let renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio); // TODO: Use player.setPixelRatio()

  let loader = new THREE.ObjectLoader();
  let camera, scene;

  // let vrButton = VRButton.createButton(renderer); // eslint-disable-line no-undef

  let events = {};

  let dom = document.createElement('div');
  dom.appendChild(renderer.domElement);

  this.dom = dom;

  this.width = 500;
  this.height = 500;

  this.load = function (json) {
    let project = json.project;

    if (project.vr !== undefined) renderer.xr.enabled = project.vr;
    if (project.shadows !== undefined) renderer.shadowMap.enabled = project.shadows;
    if (project.shadowType !== undefined) renderer.shadowMap.type = project.shadowType;
    if (project.toneMapping !== undefined) renderer.toneMapping = project.toneMapping;
    if (project.toneMappingExposure !== undefined) renderer.toneMappingExposure = project.toneMappingExposure;

    this.setScene(loader.parse(json.scene));
    this.setCamera(loader.parse(json.camera));

    events = {
      init: [],
      start: [],
      stop: [],
      keydown: [],
      keyup: [],
      pointerdown: [],
      pointerup: [],
      pointermove: [],
      update: []
    };

    let scriptWrapParams = 'player,renderer,scene,camera';
    let scriptWrapResultObj = {};

    for (let eventKey in events) {
      scriptWrapParams += ',' + eventKey;
      scriptWrapResultObj[eventKey] = eventKey;
    }

    let scriptWrapResult = JSON.stringify(scriptWrapResultObj).replace(/\"/g, '');

    for (let uuid in json.scripts) {
      let object = scene.getObjectByProperty('uuid', uuid, true);

      if (object === undefined) {
        console.warn('APP.Player: Script without object.', uuid);
        continue;
      }

      let scripts = json.scripts[uuid];

      for (let i = 0; i < scripts.length; i++) {
        let script = scripts[i];

        let functions = new Function(scriptWrapParams, script.source + '\nreturn ' + scriptWrapResult + ';').bind(
          object
        )(this, renderer, scene, camera);

        for (let name in functions) {
          if (functions[name] === undefined) continue;

          if (events[name] === undefined) {
            console.warn('APP.Player: Event type not supported (', name, ')');
            continue;
          }

          events[name].push(functions[name].bind(object));
        }
      }
    }

    dispatch(events.init, arguments);
  };

  this.setCamera = function (value) {
    camera = value;
    camera.aspect = this.width / this.height;
    camera.updateProjectionMatrix();
  };

  this.setScene = function (value) {
    scene = value;
  };

  this.setPixelRatio = function (pixelRatio) {
    renderer.setPixelRatio(pixelRatio);
  };

  this.setSize = function (width, height) {
    this.width = width;
    this.height = height;

    if (camera) {
      camera.aspect = this.width / this.height;
      camera.updateProjectionMatrix();
    }

    renderer.setSize(width, height);
  };

  function dispatch(array, event) {
    for (let i = 0, l = array.length; i < l; i++) {
      array[i](event);
    }
  }

  let time, startTime, prevTime;

  function animate() {
    time = performance.now();

    try {
      dispatch(events.update, { time: time - startTime, delta: time - prevTime });
    } catch (e) {
      console.error(e.message || e, e.stack || '');
    }

    renderer.render(scene, camera);

    prevTime = time;
  }

  this.play = function () {
    // if (renderer.xr.enabled) dom.append(vrButton);

    startTime = prevTime = performance.now();

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('pointermove', onPointerMove);

    dispatch(events.start, arguments);

    renderer.setAnimationLoop(animate);
  };

  this.stop = function () {
    // if (renderer.xr.enabled) vrButton.remove();

    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointermove', onPointerMove);

    dispatch(events.stop, arguments);

    renderer.setAnimationLoop(null);
  };

  this.render = function (time) {
    dispatch(events.update, { time: time * 1000, delta: 0 /* TODO */ });

    renderer.render(scene, camera);
  };

  this.dispose = function () {
    renderer.dispose();

    camera = undefined;
    scene = undefined;
  };

  //

  function onKeyDown(event) {
    dispatch(events.keydown, event);
  }

  function onKeyUp(event) {
    dispatch(events.keyup, event);
  }

  function onPointerDown(event) {
    dispatch(events.pointerdown, event);
  }

  function onPointerUp(event) {
    dispatch(events.pointerup, event);
  }

  function onPointerMove(event) {
    dispatch(events.pointermove, event);
  }
}

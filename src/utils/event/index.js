import mitt from 'mitt';
import Signals from 'signals';

export const signals = {
  // script
  editScript: new Signals(),

  // player
  startPlayer: new Signals(),
  stopPlayer: new Signals(),

  // vr
  toggleVR: new Signals(),
  exitedVR: new Signals(),

  // notifications
  editorCreated: new Signals(),
  editorCleared: new Signals(),

  savingStarted: new Signals(),
  savingFinished: new Signals(),

  transformModeChanged: new Signals(),
  snapChanged: new Signals(),
  spaceChanged: new Signals(),
  rendererCreated: new Signals(),
  rendererUpdated: new Signals(),
  rendererDetectKTX2Support: new Signals(),

  sceneBackgroundChanged: new Signals(),
  sceneEnvironmentChanged: new Signals(),
  sceneFogChanged: new Signals(),
  sceneFogSettingsChanged: new Signals(),
  sceneGraphChanged: new Signals(),
  sceneRendered: new Signals(),
  
  refreshSenceUI: new Signals(),

  cameraChanged: new Signals(),
  cameraResetted: new Signals(),

  geometryChanged: new Signals(),

  objectSelected: new Signals(),
  objectFocused: new Signals(),

  objectAdded: new Signals(),
  objectChanged: new Signals(),
  objectRemoved: new Signals(),

  cameraAdded: new Signals(),
  cameraRemoved: new Signals(),

  helperAdded: new Signals(),
  helperRemoved: new Signals(),

  materialAdded: new Signals(),
  materialChanged: new Signals(),
  materialRemoved: new Signals(),

  scriptAdded: new Signals(),
  scriptChanged: new Signals(),
  scriptRemoved: new Signals(),

  windowResize: new Signals(),

  showGridChanged: new Signals(),
  // 辅助坐标轴，移动物体
  showHelpersChanged: new Signals(),
  refreshSidebarObject3D: new Signals(),
  refreshSidebarEnvironment: new Signals(),
  historyChanged: new Signals(),

  refreshObjectUI: new Signals(),
  refreshTreeUI: new Signals(),

  viewportCameraChanged: new Signals(),
  viewportShadingChanged: new Signals(),

  intersectionsDetected: new Signals(),
};

const mittBus = mitt();

export const dispatch = {
  // script
  editScript: () => mittBus.emit('editScript'),

  // player
  startPlayer: () => mittBus.emit('startPlayer'),
  stopPlayer: () => mittBus.emit('stopPlayer'),

  // vr
  toggleVR: () => mittBus.emit('toggleVR'),
  exitedVR: () => mittBus.emit('exitedVR'),

  // notifications
  editorCreated: () => mittBus.emit('editorCreated'),

  editorCleared: () => mittBus.emit('editorCleared'),

  savingStarted: () => mittBus.emit('savingStarted'),
  savingFinished: () => mittBus.emit('savingFinished'),

  transformModeChanged: () => mittBus.emit('transformModeChanged'),
  snapChanged: () => mittBus.emit('snapChanged'),
  spaceChanged: () => mittBus.emit('spaceChanged'),
  rendererCreated: (renderer) => mittBus.emit('rendererCreated', renderer),
  rendererUpdated: () => mittBus.emit('rendererUpdated'),
  rendererDetectKTX2Support: (loader) => mittBus.emit('rendererDetectKTX2Support', loader),

  sceneBackgroundChanged: () => mittBus.emit('sceneBackgroundChanged'),
  sceneEnvironmentChanged: () => mittBus.emit('sceneEnvironmentChanged'),
  sceneFogChanged: () => mittBus.emit('sceneFogChanged'),
  sceneFogSettingsChanged: () => mittBus.emit('sceneFogSettingsChanged'),
  sceneGraphChanged: () => mittBus.emit('sceneGraphChanged'),
  sceneRendered: () => mittBus.emit('sceneRendered'),

  refreshSenceUI: () => mittBus.emit('refreshSenceUI'),
  
  cameraChanged: (camera) => mittBus.emit('cameraChanged', camera),
  cameraResetted: () => mittBus.emit('cameraResetted'),

  geometryChanged: (object) => mittBus.emit('geometryChanged', object),

  objectSelected: (object) => mittBus.emit('objectSelected', object),
  objectFocused: (object) => mittBus.emit('objectFocused', object),

  objectAdded: (object) => mittBus.emit('objectAdded', object),
  objectChanged: (object) => mittBus.emit('objectChanged', object),
  objectRemoved: (object) => mittBus.emit('objectRemoved', object),

  cameraAdded: (camera) => mittBus.emit('cameraAdded', camera),
  cameraRemoved: (camera) => mittBus.emit('cameraRemoved', camera),

  helperAdded: (helper) => mittBus.emit('helperAdded', helper),
  helperRemoved: (helper) => mittBus.emit('helperRemoved', helper),

  materialAdded: () => mittBus.emit('materialAdded'),
  materialChanged: (object, materialSlot) => mittBus.emit('materialChanged', object, materialSlot),
  materialRemoved: () => mittBus.emit('materialRemoved'),

  scriptAdded: () => mittBus.emit('scriptAdded'),
  scriptChanged: () => mittBus.emit('scriptChanged'),
  scriptRemoved: () => mittBus.emit('scriptRemoved'),

  windowResize: () => mittBus.emit('windowResize'),

  showGridChanged: (visible) => mittBus.emit('showGridChanged', visible),
  // 辅助坐标轴，移动物体
  showHelpersChanged: (visible) => mittBus.emit('showHelpersChanged', visible),
  refreshSidebarObject3D: (object) => mittBus.emit('refreshSidebarObject3D', object),
  refreshSidebarEnvironment: () => mittBus.emit('refreshSidebarEnvironment'),
  historyChanged: (cmd) => mittBus.emit('historyChanged', cmd),

  refreshObjectUI: (object, attr) => mittBus.emit('refreshObjectUI', object, attr),

  refreshTreeUI: ({ object, parent }) => mittBus.emit('refreshTreeUI', { object, parent }),

  viewportCameraChanged: () => mittBus.emit('viewportCameraChanged'),
  viewportShadingChanged: () => mittBus.emit('viewportShadingChanged'),

  intersectionsDetected: (intersects) => mittBus.emit('intersectionsDetected', intersects)
};

export const onEvent = {
  // script
  editScript: (fn) => mittBus.on('editScript', fn),

  // player
  startPlayer: (fn) => mittBus.on('startPlayer', fn),
  stopPlayer: (fn) => mittBus.on('stopPlayer', fn),

  // vr
  toggleVR: (fn) => mittBus.on('toggleVR', fn),
  exitedVR: (fn) => mittBus.on('exitedVR', fn),

  // notifications
  editorCreated: (fn) => mittBus.on('editorCreated', fn),
  editorCleared: (fn) => mittBus.on('editorCleared', fn),

  savingStarted: (fn) => mittBus.on('savingStarted', fn),
  savingFinished: (fn) => mittBus.on('savingFinished', fn),

  transformModeChanged: (fn) => mittBus.on('transformModeChanged', fn),
  snapChanged: (fn) => mittBus.on('snapChanged', fn),
  spaceChanged: (fn) => mittBus.on('spaceChanged', fn),
  rendererCreated: (fn) => mittBus.on('rendererCreated', fn),
  rendererUpdated: (fn) => mittBus.on('rendererUpdated', fn),
  rendererDetectKTX2Support: (fn) => mittBus.on('rendererDetectKTX2Support', fn),

  sceneBackgroundChanged: (fn) => mittBus.on('sceneBackgroundChanged', fn),
  sceneEnvironmentChanged: (fn) => mittBus.on('sceneEnvironmentChanged', fn),
  sceneFogChanged: (fn) => mittBus.on('sceneFogChanged', fn),
  sceneFogSettingsChanged: (fn) => mittBus.on('sceneFogSettingsChanged', fn),
  sceneGraphChanged: (fn) => mittBus.on('sceneGraphChanged', fn),
  sceneRendered: (fn) => mittBus.on('sceneRendered', fn),
  
  refreshSenceUI: (fn) => mittBus.on('refreshSenceUI', fn),

  cameraChanged: (fn) => mittBus.on('cameraChanged', fn),
  cameraResetted: (fn) => mittBus.on('cameraResetted', fn),

  geometryChanged: (fn) => mittBus.on('geometryChanged', fn),

  objectSelected: (fn) => mittBus.on('objectSelected', fn),
  objectFocused: (fn) => mittBus.on('objectFocused', fn),

  objectAdded: (fn) => mittBus.on('objectAdded', fn),
  objectChanged: (fn) => mittBus.on('objectChanged', fn),
  objectRemoved: (fn) => mittBus.on('objectRemoved', fn),

  cameraAdded: (fn) => mittBus.on('cameraAdded', fn),
  cameraRemoved: (fn) => mittBus.on('cameraRemoved', fn),

  helperAdded: (fn) => mittBus.on('helperAdded', fn),
  helperRemoved: (fn) => mittBus.on('helperRemoved', fn),

  materialAdded: (fn) => mittBus.on('materialAdded', fn),
  materialChanged: (fn) => mittBus.on('materialChanged', fn),
  materialRemoved: (fn) => mittBus.on('materialRemoved', fn),

  scriptAdded: (fn) => mittBus.on('scriptAdded', fn),
  scriptChanged: (fn) => mittBus.on('scriptChanged', fn),
  scriptRemoved: (fn) => mittBus.on('scriptRemoved', fn),

  windowResize: (fn) => mittBus.on('windowResize', fn),

  showGridChanged: (fn) => mittBus.on('showGridChanged', fn),
  // 辅助坐标轴，移动物体
  showHelpersChanged: (fn) => mittBus.on('showHelpersChanged', fn),
  refreshSidebarObject3D: (fn) => mittBus.on('refreshSidebarObject3D', fn),
  refreshSidebarEnvironment: (fn) => mittBus.on('refreshSidebarEnvironment', fn),
  historyChanged: (fn) => mittBus.on('historyChanged', fn),

  refreshObjectUI: (fn) => mittBus.on('refreshObjectUI', fn),
  refreshTreeUI: (fn) => mittBus.on('refreshTreeUI', fn),

  viewportCameraChanged: (fn) => mittBus.on('viewportCameraChanged', fn),
  viewportShadingChanged: (fn) => mittBus.on('viewportShadingChanged', fn),

  intersectionsDetected: (fn) => mittBus.on('intersectionsDetected', fn)
};

export const offEvent = {
  objectSelected: (fn) => mittBus.off('objectSelected', fn),
  materialChanged: (fn) => mittBus.off('materialChanged', fn)
};

export default mittBus;

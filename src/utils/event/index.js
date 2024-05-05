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



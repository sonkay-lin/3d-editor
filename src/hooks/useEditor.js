import { Editor } from '@/utils/Editor';
let editor;

export const initEditor = () => {
  editor = new Editor();
  // 初始化编辑器获取本地存储
  editor.storage.init(() => {
    editor.storage.get((state) => {
      // if (isLoadingFromHash) return;

      if (state !== undefined) {
        editor.fromJSON(state);
      } else {
        editor.dispatch.editorCreated()
      }

      // TODO
      const selected = undefined;
      // const selected = editor.config.getKey('selected');

      if (selected !== undefined) {
        editor.selectByUuid(selected);
      }
    });

    const saveState = () => editor.storage.set(editor.toJSON());

    // editor.onEvent.geometryChanged(saveState);
    // editor.onEvent.objectAdded(saveState);
    // editor.onEvent.objectChanged(saveState);
    // editor.onEvent.objectRemoved(saveState);
    // editor.onEvent.materialChanged(saveState);
    // editor.onEvent.sceneBackgroundChanged(saveState);
    // editor.onEvent.sceneEnvironmentChanged(saveState);
    // editor.onEvent.sceneFogChanged(saveState);
    // editor.onEvent.sceneGraphChanged(saveState);
    // editor.onEvent.scriptChanged(saveState);
    // editor.onEvent.historyChanged(saveState);
  });
  return editor;
};

export const getEditor = () => {
  return editor;
};

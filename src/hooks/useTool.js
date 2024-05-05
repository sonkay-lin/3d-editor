import { ref } from 'vue';
import { getEditor } from './useEditor';
import { ElMessage } from 'element-plus';
import { MODE } from '@/utils/Editor';

export const useTool = () => {
  let editor;
  const isFullSceen = ref(false);

  const setFullSceen = () => {
    const el = document.documentElement;
    const _isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    if (!_isFullScreen) {
      //进入全屏
      (el.requestFullscreen && el.requestFullscreen()) ||
        (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
        (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
        (el.msRequestFullscreen && el.msRequestFullscreen());
      isFullSceen.value = true;
    } else {
      //退出全屏
      document.exitFullscreen
        ? document.exitFullscreen()
        : document.mozCancelFullScreen
        ? document.mozCancelFullScreen()
        : document.webkitExitFullscreen
        ? document.webkitExitFullscreen()
        : '';
      isFullSceen.value = false;
    }
  };

  const delObject = () => {
    editor = getEditor();
    const { selected } = editor;
    if (!selected) {
      ElMessage.warning('请选择要删除的物体！');
      return;
    }
    editor.removeObject(selected);
  };

  const dev = () => {
    ElMessage.success('正在开发的功能');
  };

  const save = (value) => {
    try {
      editor = getEditor();
      editor.storage.set(editor.toJSON());
      const newConfig = JSON.stringify(value);
      localStorage.setItem('sceneConfig', newConfig);
      ElMessage.success('保存成功');
    } catch (error) {
      ElMessage.error('保存失败');
      console.error(error);
    }
  };

  const copy = () => {
    editor = getEditor();
    const { selected, event } = editor;
    if (!selected) return;
    const newObj = selected.clone();
    editor.addObject(newObj);
    event.sceneGraphChanged.dispatch();
  };

  return {
    isFullSceen,
    setFullSceen,
    delObject,
    copy,
    dev,
    save
  };
};

import { getEditor } from '@/hooks/useEditor.js';
import { Command } from '../Command.js';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */
class SetValueCommand extends Command {
  constructor(object, attributeName, newValue) {
    const editor = getEditor();
    super(editor);
    this.type = 'SetValueCommand';
    this.name = `设置 ${attributeName}`;
    this.updatable = true;
    this.object = object;
    this.attributeName = attributeName;
    this.oldValue = this.getAttrValue();
    this.newValue = newValue;
  }

  getAttrValue() {
    const attrs = this.attributeName.split('.');
    if (attrs.length > 0) {
      let value = this.object;
      while (attrs.length > 0) {
        const attribute = attrs.shift();
        if (value[attribute] !== undefined) {
          value = value[attribute];
        } else {
          console.warn('getAttrValue fail!');
          break;
        }
      }
      return value;
    } else {
      if (this.object[this.attributeName]) {
        return this.object[this.attributeName];
      }
    }
  }

  setAttrValue(value) {
    const attrs = this.attributeName.split('.');
    if (attrs.length > 1) {
      let object = this.object;
      while (attrs.length > 0) {
        let attribute = attrs.shift();
        if (object[attribute] !== undefined) {
          object = object[attribute];
          if (attrs.length === 1) {
            attribute = attrs.shift();
            object[attribute] = value;
            console.log(object);
          }
        } else {
          console.warn('setAttrValue fail!');
          break;
        }
      }
    } else {
      this.object[this.attributeName] = value;
    }
  }

  execute() {
    this.setAttrValue(this.newValue);
    // 如果是隐藏，将灯光和相机的辅助线也隐藏
    if (this.attributeName === 'visible') {
      const { helpers } = this.editor;
      const { id } = this.object;
      if (helpers[id]) {
        helpers[id].visible = this.newValue;
      }
    }
    // this.object[this.attributeName] = this.newValue;
    this.editor.dispatch.objectChanged(this.object);
    // this.editor.signals.sceneGraphChanged.dispatch();
    // 如果是name属性，刷新页面ui
    if (this.attributeName === 'name' || this.attributeName === 'visible') {
      this.editor.dispatch.refreshObjectUI(this.object, this.attributeName);
    }
  }

  undo() {
    this.setAttrValue(this.oldValue);
    // 如果是隐藏，将灯光和相机的辅助线也隐藏
    if (this.attributeName === 'visible') {
      const { helpers } = this.editor;
      const { id } = this.object;
      if (helpers[id]) {
        helpers[id].visible = this.oldValue;
      }
    }
    // this.object[this.attributeName] = this.oldValue;
    this.editor.dispatch.objectChanged(this.object);
    // this.editor.signals.sceneGraphChanged.dispatch();
    // 如果是name属性，刷新页面ui
    if (this.attributeName === 'name' || this.attributeName === 'visible') {
      this.editor.dispatch.refreshObjectUI(this.object, this.attributeName);
    }
  }

  update(cmd) {
    this.newValue = cmd.newValue;
  }

  toJSON() {
    const output = super.toJSON(this);
    output.objectUuid = this.object.uuid;
    // TODO: when attributeName is Array
    output.attributeName = this.attributeName;
    output.oldValue = this.oldValue;
    output.newValue = this.newValue;
    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);
    // TODO: when attributeName is Array
    this.attributeName = json.attributeName;
    this.oldValue = json.oldValue;
    this.newValue = json.newValue;
    this.object = this.editor.objectByUuid(json.objectUuid);
  }
}

export { SetValueCommand };

import { getEditor } from '@/hooks/useEditor.js';
import { Command } from '../Command.js';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */
class SetGeometryValueCommand extends Command {
  constructor(object, attributeName, newValue) {
    const editor = getEditor();
    super(editor);

    this.type = 'SetGeometryValueCommand';
    this.name = `修改几何属性.${attributeName}`;

    this.object = object;
    this.attributeName = attributeName;
    this.oldValue = object !== undefined ? object.geometry[attributeName] : undefined;
    this.newValue = newValue;
  }

  execute() {
    this.object.geometry[this.attributeName] = this.newValue;
    this.editor.event.objectChanged.dispatch(this.object);
    this.editor.event.geometryChanged.dispatch(this.object);
    this.editor.event.sceneGraphChanged.dispatch();
  }

  undo() {
    this.object.geometry[this.attributeName] = this.oldValue;
    this.editor.event.objectChanged.dispatch(this.object);
    this.editor.event.geometryChanged.dispatch(this.object);
    this.editor.event.sceneGraphChanged.dispatch();
  }

  toJSON() {
    const output = super.toJSON(this);

    output.objectUuid = this.object.uuid;
    output.attributeName = this.attributeName;
    output.oldValue = this.oldValue;
    output.newValue = this.newValue;

    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);

    this.object = this.editor.objectByUuid(json.objectUuid);
    this.attributeName = json.attributeName;
    this.oldValue = json.oldValue;
    this.newValue = json.newValue;
  }
}

export { SetGeometryValueCommand };

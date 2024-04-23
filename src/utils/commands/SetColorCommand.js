import { getEditor } from '@/hooks/useEditor.js';
import { Command } from '../Command.js';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue integer representing a hex color value
 * @constructor
 */
class SetColorCommand extends Command {
  constructor(object, attributeName, newValue) {
    const editor = getEditor();
    super(editor);

    this.type = 'SetColorCommand';
    this.name = `修改 ${attributeName}`;
    this.updatable = true;
    this.object = object;
    this.attributeName = attributeName;
    this.oldValue = object !== undefined ? this.object[this.attributeName].clone() : undefined;
    this.newValue = newValue;
  }

  execute() {
    // this.object[this.attributeName].setHex(this.newValue);
    this.object[this.attributeName] = this.newValue;
    this.editor.dispatch.objectChanged(this.object);
  }

  undo() {
    this.object[this.attributeName] = this.oldValue;
    this.editor.dispatch.objectChanged(this.object);
  }

  update(cmd) {
    this.newValue = cmd.newValue;
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

export { SetColorCommand };

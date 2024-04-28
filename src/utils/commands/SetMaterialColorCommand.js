import { getEditor } from '@/hooks/useEditor.js';
import { Command } from '../Command.js';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue integer representing a hex color value
 * @constructor
 */
class SetMaterialColorCommand extends Command {
  constructor(object, attributeName, newValue, materialSlot) {
    const editor = getEditor();
    super(editor);

    this.type = 'SetMaterialColorCommand';
    this.name = `修改材质.${attributeName}`;
    this.updatable = true;

    this.object = object;
    this.materialSlot = materialSlot;

    this.material = this.object !== undefined ? this.editor.getObjectMaterial(object, materialSlot) : undefined;

    this.oldValue = this.material !== undefined ? this.material[attributeName].clone() : undefined;
    this.newValue = newValue;

    this.attributeName = attributeName;
  }

  execute() {
    // this.material[this.attributeName].setHex(this.newValue);
    this.material[this.attributeName] = this.newValue;
    this.editor.event.materialChanged.dispatch(this.object, this.materialSlot);
  }

  undo() {
    this.material[this.attributeName] = this.oldValue;
    this.editor.event.materialChanged.dispatch(this.object, this.materialSlot);
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

export { SetMaterialColorCommand };

import { getEditor } from '@/hooks/useEditor.js';
import { Command } from '../Command.js';

class SetMaterialVectorCommand extends Command {
  constructor(object, attributeName, newValue, materialSlot) {
    const editor = getEditor()
    super(editor);

    this.type = 'SetMaterialColorCommand';
    this.name = `修改材质.${attributeName}`;
    this.updatable = true;

    this.object = object;
    this.materialSlot = materialSlot;

    this.material = this.editor.getObjectMaterial(object, materialSlot);

    this.oldValue = this.material !== undefined ? this.material[attributeName].toArray() : undefined;
    this.newValue = newValue;

    this.attributeName = attributeName;
  }

  execute() {
    this.material[this.attributeName].fromArray(this.newValue);
    this.editor.dispatch.materialChanged(this.object, this.materialSlot);
  }

  undo() {
    this.material[this.attributeName].fromArray(this.oldValue);
    this.editor.dispatch.materialChanged(this.object, this.materialSlot);
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

export { SetMaterialVectorCommand };

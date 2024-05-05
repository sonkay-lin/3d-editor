import { getEditor } from '@/hooks/useEditor.js';
import { Command } from '../Command.js';
import { ObjectLoader } from 'three';
class AddMaterialCommand extends Command {
  constructor(object, newMaterial) {
    const editor = getEditor();
    super(editor);

    this.type = 'AddMaterialCommand';
    this.name = '添加材质';
    this.object = object;
    this.originMaterial = object.material;
    this.newMaterial = newMaterial
  }
  execute() {
    if (Array.isArray(this.originMaterial)) {
      const length = this.originMaterial.length;
      this.editor.setObjectMaterial(this.object, length, this.newMaterial);
    } else {
      this.object.material = [this.originMaterial];
      this.editor.setObjectMaterial(this.object, 1, this.newMaterial);
    }
    this.editor.event.materialChanged.dispatch(this.object)
  }
  undo() {
    this.object.material = this.originMaterial
  }
  toJSON() {}
  fromJSON() {}
}

export { AddMaterialCommand };

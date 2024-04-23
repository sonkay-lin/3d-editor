import { getEditor } from '@/hooks/useEditor.js';
import { Command } from '../Command.js';
import { ObjectLoader } from 'three';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @constructor
 */
class AddObjectCommand extends Command {
  constructor(object, isSelect = true) {
    const editor = getEditor();
    super(editor);

    this.type = 'AddObjectCommand';
    this.isSelect = isSelect;
    this.object = object;
    if (object !== undefined) {
      this.name = `添加物体: ${object.name}`;
    }
  }

  execute() {
    this.editor.addObject(this.object);
    if (this.isSelect) {
      this.editor.select(this.object);
    }
  }

  undo() {
    this.editor.removeObject(this.object);
    if (this.isSelect) {
      this.editor.deselect();
    }
  }

  toJSON() {
    const output = super.toJSON(this);

    output.object = this.object.toJSON();

    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);

    this.object = this.editor.objectByUuid(json.object.object.uuid);

    if (this.object === undefined) {
      const loader = new ObjectLoader();
      this.object = loader.parse(json.object);
    }
  }
}

export { AddObjectCommand };

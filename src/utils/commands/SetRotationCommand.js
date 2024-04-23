import { Command } from '../Command.js';
import { Euler } from 'three';
import { getEditor } from '@/hooks/useEditor';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param newRotation THREE.Euler
 * @param optionalOldRotation THREE.Euler
 * @constructor
 */
class SetRotationCommand extends Command {
  constructor(object, newRotation, optionalOldRotation) {
    const editor = getEditor();
    super(editor);

    this.type = 'SetRotationCommand';
    this.name = '旋转';
    this.updatable = true;

    this.object = object;

    if (object !== undefined && newRotation !== undefined) {
      this.oldRotation = object.rotation.clone();
      this.newRotation = newRotation.clone();
    }

    if (optionalOldRotation !== undefined) {
      this.oldRotation = optionalOldRotation.clone();
    }
  }

  execute() {
    this.object.rotation.copy(this.newRotation);
    this.object.updateMatrixWorld(true);
    this.editor.dispatch.objectChanged(this.object);
  }

  undo() {
    this.object.rotation.copy(this.oldRotation);
    this.object.updateMatrixWorld(true);
    this.editor.dispatch.objectChanged(this.object);
  }

  update(command) {
    this.newRotation.copy(command.newRotation);
  }

  toJSON() {
    const output = super.toJSON(this);

    output.objectUuid = this.object.uuid;
    output.oldRotation = this.oldRotation.toArray();
    output.newRotation = this.newRotation.toArray();

    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);

    this.object = this.editor.objectByUuid(json.objectUuid);
    this.oldRotation = new Euler().fromArray(json.oldRotation);
    this.newRotation = new Euler().fromArray(json.newRotation);
  }
}

export { SetRotationCommand };

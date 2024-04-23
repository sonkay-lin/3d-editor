import { Command } from '../Command.js';
import { getEditor } from '@/hooks/useEditor.js';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param newUuid string
 * @constructor
 */
class SetUuidCommand extends Command {
  constructor(object, newUuid) {
    const editor = getEditor();
    super(editor);

    this.type = 'SetUuidCommand';
    this.name = 'Update UUID';

    this.object = object;

    this.oldUuid = object !== undefined ? object.uuid : undefined;
    this.newUuid = newUuid;
  }

  execute() {
    this.object.uuid = this.newUuid;
    this.editor.dispatch.objectChanged(this.object);
    this.editor.dispatch.sceneGraphChanged();
  }

  undo() {
    this.object.uuid = this.oldUuid;
    this.editor.dispatch.objectChanged(this.object);
    this.editor.dispatch.sceneGraphChanged();
  }

  toJSON() {
    const output = super.toJSON(this);

    output.oldUuid = this.oldUuid;
    output.newUuid = this.newUuid;

    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);

    this.oldUuid = json.oldUuid;
    this.newUuid = json.newUuid;
    this.object = this.editor.objectByUuid(json.oldUuid);

    if (this.object === undefined) {
      this.object = this.editor.objectByUuid(json.newUuid);
    }
  }
}

export { SetUuidCommand };

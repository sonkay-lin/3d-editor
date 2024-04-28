import { Command } from '../Command.js';
import { SetUuidCommand } from './SetUuidCommand.js';
import { SetValueCommand } from './SetValueCommand.js';
import { AddObjectCommand } from './AddObjectCommand.js';
import { getEditor } from '@/hooks/useEditor.js';

/**
 * @param editor Editor
 * @param scene containing children to import
 * @constructor
 */
class SetSceneCommand extends Command {
  constructor(scene) {
    const editor = getEditor();
    super(editor);

    this.type = 'SetSceneCommand';
    this.name = 'Set Scene';

    this.cmdArray = [];

    if (scene !== undefined) {
      this.cmdArray.push(new SetUuidCommand(this.editor.scene, scene.uuid));
      this.cmdArray.push(new SetValueCommand(this.editor.scene, 'name', scene.name));
      console.log(scene)
      this.cmdArray.push(
        new SetValueCommand(this.editor.scene, 'userData', JSON.parse(JSON.stringify(scene.userData)))
      );

      while (scene.children.length > 0) {
        const child = scene.children.pop();
        this.cmdArray.push(new AddObjectCommand(child));
      }
    }
  }

  execute() {
    this.editor.event.sceneGraphChanged.active = false;

    for (let i = 0; i < this.cmdArray.length; i++) {
      this.cmdArray[i].execute();
    }

    this.editor.event.sceneGraphChanged.active = true;
    this.editor.event.sceneGraphChanged.dispatch();
  }

  undo() {
    this.editor.event.sceneGraphChanged.active = false;

    for (let i = this.cmdArray.length - 1; i >= 0; i--) {
      this.cmdArray[i].undo();
    }

    this.editor.event.sceneGraphChanged.active = true;
    this.editor.event.sceneGraphChanged.dispatch();
  }

  toJSON() {
    const output = super.toJSON(this);

    const cmds = [];
    for (let i = 0; i < this.cmdArray.length; i++) {
      cmds.push(this.cmdArray[i].toJSON());
    }

    output.cmds = cmds;

    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);

    const cmds = json.cmds;
    for (let i = 0; i < cmds.length; i++) {
      const cmd = new window[cmds[i].type](); // creates a new object of type "json.type"
      cmd.fromJSON(cmds[i]);
      this.cmdArray.push(cmd);
    }
  }
}

export { SetSceneCommand };

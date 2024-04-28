import { getEditor } from '@/hooks/useEditor.js';
import { Command } from '../Command.js';
import { ObjectLoader } from 'three';

/**
 * @param editor Editor
 * @param object THREE.Object3D
 * @param newMaterial THREE.Material
 * @constructor
 */
class SetMaterialCommand extends Command {
  constructor(object, newMaterial, materialSlot) {
    const editor = getEditor()
    super(editor);

    this.type = 'SetMaterialCommand';
    this.name = '修改材质';

    this.object = object;
    this.materialSlot = materialSlot;

    this.oldMaterial = this.editor.getObjectMaterial(object, materialSlot);
    this.newMaterial = newMaterial;
  }

  execute() {
    this.editor.setObjectMaterial(this.object, this.materialSlot, this.newMaterial);
    this.editor.event.materialChanged.dispatch(this.object, this.materialSlot);
  }

  undo() {
    this.editor.setObjectMaterial(this.object, this.materialSlot, this.oldMaterial);
    this.editor.event.materialChanged.dispatch(this.object, this.materialSlot);
  }

  toJSON() {
    const output = super.toJSON(this);

    output.objectUuid = this.object.uuid;
    output.oldMaterial = this.oldMaterial.toJSON();
    output.newMaterial = this.newMaterial.toJSON();

    return output;
  }

  fromJSON(json) {
    super.fromJSON(json);

    this.object = this.editor.objectByUuid(json.objectUuid);
    this.oldMaterial = parseMaterial(json.oldMaterial);
    this.newMaterial = parseMaterial(json.newMaterial);

    function parseMaterial(json) {
      const loader = new ObjectLoader();
      const images = loader.parseImages(json.images);
      const textures = loader.parseTextures(json.textures, images);
      const materials = loader.parseMaterials([json], textures);
      return materials[json.uuid];
    }
  }
}

export { SetMaterialCommand };

import { MODE } from "./Editor";

class Selector {
  constructor(editor) {
    const { event } = editor;

    this.editor = editor;
    this.event = event;

    this.event.intersectionsDetected.add((intersects) => {
      if (intersects.length > 0) {
        const object = intersects[0].object;

        // if (object.userData) {
        //   const { click } = object.userData
        //   click && click()
        // }

        if (object.userData.object !== undefined) {
          // helper
          this.select(object.userData.object);
        } else {
          this.select(object);
        }
      } else {
        this.select(null);
      }
    });
  }

  select(object) {
    if (this.editor.selected === object) return;

    if (this.editor.mode === MODE.CLIPPING) {
      this.editor.selected && this.editor.selected.traverse(child => {
        if (child.material) {
          child.material.clippingPlanes = null;
          child.material.clipShadows = false;
          child.material.alphaToCoverage = false;
        }
      })
      this.editor.mode = MODE.DEFAULT
    }

    let uuid = null;
    if (object !== null) {
      uuid = object.uuid;
    }
    this.editor.selected = object;
    // this.editor.config.setKey('selected', uuid);
    this.event.objectSelected.dispatch(object);
  }

  deselect() {
    this.select(null);
  }
}

export { Selector };

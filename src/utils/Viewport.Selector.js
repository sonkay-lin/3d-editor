class Selector {
  constructor(editor) {
    const { onEvent, dispatch } = editor;

    this.editor = editor;
    this.signals = onEvent;
    this.dispatch = dispatch;

    this.signals.intersectionsDetected((intersects) => {
      if (intersects.length > 0) {
        const object = intersects[0].object;

        if (object.userData) {
          const { click } = object.userData
          click && click()
        }

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

    let uuid = null;
    if (object !== null) {
      uuid = object.uuid;
    }
    this.editor.selected = object;
    // this.editor.config.setKey('selected', uuid);
    this.dispatch.objectSelected(object);
  }

  deselect() {
    this.select(null);
  }
}

export { Selector };

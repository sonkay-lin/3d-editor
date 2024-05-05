let controls;
let transformControls;
let render;
let addStart;
let cancelAdd;
let useClipping;
let useCloseGround
export const useViewport = (option) => {
  controls = option.controls;
  transformControls = option.transformControls;
  render = option.render;
  addStart = option.addStart;
  cancelAdd = option.cancelAdd;
  useClipping = option.useClipping;
  useCloseGround = option.useCloseGround;
};

export const getViewport = () => {
  return {
    controls,
    transformControls,
    render,
    addStart,
    cancelAdd,
    useClipping,
    useCloseGround
  };
};

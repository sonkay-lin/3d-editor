let controls;
let transformControls;
let render;
let addStart;
let cancelAdd;
let useClipping;
export const useViewport = (option) => {
  controls = option.controls;
  transformControls = option.transformControls;
  render = option.render;
  addStart = option.addStart;
  cancelAdd = option.cancelAdd;
  useClipping = option.useClipping;
};

export const getViewport = () => {
  return {
    controls,
    transformControls,
    render,
    addStart,
    cancelAdd,
    useClipping
  };
};

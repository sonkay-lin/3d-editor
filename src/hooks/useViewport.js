let controls;
let transformControls;
let render;
let addStart
export const useViewport = (option) => {
  controls = option.controls;
  transformControls = option.transformControls;
  render = option.render;
  addStart = option.addStart
};

export const getViewport = () => {
  return {
    controls,
    transformControls,
    render,
    addStart
  };
}
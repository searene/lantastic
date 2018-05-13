declare module 'draft-js-image-plugin' {
  interface ImageBlock {
    component: any;
    editable: boolean;
  }
  interface createImagePluginReturn {
    blockRendererFn: null | ImageBlock;
    addImage: any;
  }
  function createImagePlugin(): createImagePluginReturn;
  export default createImagePlugin;
}
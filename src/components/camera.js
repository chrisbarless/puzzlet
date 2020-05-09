import createDom2dCamera from 'dom-2d-camera';
import { mat4, vec4 } from 'gl-matrix';

const increment = 10;
let camera;

function Camera(canvas) {
  const cameraLog = CameraDebugger();

  camera = createDom2dCamera(canvas, {
    scaleBounds: [1, 10],
    // panSpeed: 10,
    isNdc: false,
    isRotate: false,
    onWheel: cameraLog,
    onMouseUp: cameraLog,
  });
  camera.refresh();

  // Move Left
  document
    .getElementById('button-arrow-left')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.translate([increment * camera.scaling, 0]);
    });
  // Move Right
  document
    .getElementById('button-arrow-right')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.translate([-increment * camera.scaling, 0]);
    });
  // Move Up
  document
    .getElementById('button-arrow-up')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.translate([0, increment * camera.scaling]);
    });
  // Move Down
  document
    .getElementById('button-arrow-down')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.translate([0, -increment * camera.scaling]);
    });
  // Zoom in
  document
    .getElementById('button-arrow-plus')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.zoom(2);
    });
  // Zoom out
  document
    .getElementById('button-arrow-minus')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.zoom(0.5);
    });

  return camera;
}

function CameraDebugger() {
  return () => {
    if (process.env.NODE_ENV === 'production') return null;
    console.clear();
    const { view } = camera;
    for (const key in camera) {
      if (
        [
          'translation',
          'target',
          'scaling',
          'distance',
          // 'view',
          'viewCenter',
        ].includes(key)
      ) {
        console.log(key);
        console.log(camera[key]);
      }
    }
    // console.dir(view);
    console.log(view[0], view[1], view[2], view[3]);
    console.log(view[4], view[5], view[6], view[7]);
    console.log(view[8], view[9], view[10], view[11]);
    console.log(view[12], view[13], view[14], view[15]);
  };
}

export default Camera;

import createDom2dCamera from 'dom-2d-camera';

const increment = 1;
let camera;

function Camera(canvas) {
  const cameraLog = CameraDebugger();

  camera = createDom2dCamera(canvas, {
    // target: [5, 1],
    // target: [-96 / 2, -61 / 2],
    // target: [canvas.width / 2, canvas.height / 2],
    scaleBounds: [10, 100],
    isNdc: false,
    isRotate: false,
    onWheel: cameraLog,
    onMouseUp: cameraLog,
  });
  camera.refresh();
  // camera.lookAt([canvas.width / 2, canvas.height / 2], 0.1);

  // Move Left
  document
    .getElementById('button-arrow-left')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.pan([-increment, 0]);
    });
  // Move Right
  document
    .getElementById('button-arrow-right')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.pan([increment, 0]);
    });
  // Move Up
  document
    .getElementById('button-arrow-up')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.pan([0, increment]);
    });
  // Move Down
  document
    .getElementById('button-arrow-down')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.pan([0, -increment]);
    });
  // Zoom in
  document
    .getElementById('button-arrow-plus')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.zoom(2);
      // const zoomedVal = camera.position.z - increment;
      // zoomedVal > minZoom && camera.position.setZ(zoomedVal);
    });
  // Zoom out
  document
    .getElementById('button-arrow-minus')
    .addEventListener('click', (event) => {
      event.preventDefault();
      camera.zoom(-2);
      // const zoomedVal = camera.position.z + increment;
      // zoomedVal < maxZoom && camera.position.setZ(zoomedVal);
    });

  return camera;
}

function CameraDebugger() {
  if (process.env.NODE_ENV === 'production') return null;

  return () => {
    console.clear();
    for (const key in camera) {
      if (
        [
          'translation',
          'target',
          'scaling',
          'distance',
          'view',
          'viewCenter',
        ].includes(key)
      ) {
        console.log(key);
        console.log(camera[key]);
      }
    }
  };
}

export default Camera;

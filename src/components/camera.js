import createDom2dCamera from 'dom-2d-camera';

let camera;

function cameraLog() {
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
}
const increment = 1;

function Camera(canvas) {
  camera = createDom2dCamera(canvas, {
    scaleBounds: [10, 100],
    // distance: 0.1,
    isRotate: false,
    onWheel: cameraLog,
    onMouseUp: cameraLog,
  });
  camera.noRotate = true;
  camera.refresh();
  // camera.lookAt([canvas.width / 2, canvas.height / 2], 0.1);

  // Move Left
  document.getElementById('button-arrow-left').addEventListener('click', () => {
    camera.pan([-increment, 0]);
  });
  // Move Right
  document
    .getElementById('button-arrow-right')
    .addEventListener('click', () => {
      camera.pan([increment, 0]);
    });
  // Move Up
  document.getElementById('button-arrow-up').addEventListener('click', () => {
    camera.pan([0, increment]);
  });
  // Move Down
  document.getElementById('button-arrow-down').addEventListener('click', () => {
    camera.pan([0, -increment]);
  });
  // Zoom in
  document.getElementById('button-arrow-plus').addEventListener('click', () => {
    camera.zoom(2);
    // const zoomedVal = camera.position.z - increment;
    // zoomedVal > minZoom && camera.position.setZ(zoomedVal);
  });
  // Zoom out
  document
    .getElementById('button-arrow-minus')
    .addEventListener('click', () => {
      camera.zoom(-2);
      // const zoomedVal = camera.position.z + increment;
      // zoomedVal < maxZoom && camera.position.setZ(zoomedVal);
    });

  return camera;
}

export default Camera;

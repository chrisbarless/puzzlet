import createDom2dCamera from 'dom-2d-camera';
import HexagonGrid from './components/hexagon-grid';
import Controls from './components/controls';

let canvas;
let context;
let grid;
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

function onWindowResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function init() {
  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  context = canvas.getContext('2d');
  document.body.appendChild(canvas);

  camera = createDom2dCamera(canvas, {
    // scaleBounds: [10, 100],
    distance: 0.1,
    isRotate: false,
    onWheel: cameraLog,
    onMouseUp: cameraLog,
  });
  camera.noRotate = true;
  // camera.lookAt([canvas.width / 2, canvas.height / 2], 0.1);

  grid = new HexagonGrid(context, camera);

  Controls(camera);

  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();

  if (process.env.NODE_ENV !== 'production') {
    document.getElementById('logo').removeAttribute('href');
  }
}

function tick() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  camera.tick();
  grid.tick();

  requestAnimationFrame(tick);
}

init();
tick();

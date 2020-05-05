import createDom2dCamera from 'dom-2d-camera';
import HexagonGrid from './components/hexagon-grid';
import Controls from './components/controls';

let canvas;
let context;
let grid;
let camera;

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
    scaleBounds: [10, 100],
    isRotate: false,
    onWheel(e) {},
  });
  camera.noRotate = true;
  // camera.lookAt([canvas.width / 2, canvas.height / 2]);

  grid = new HexagonGrid(context, camera);

  Controls(camera);

  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();
}

function tick() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  camera.tick();
  grid.tick();

  requestAnimationFrame(tick);
}

init();
tick();

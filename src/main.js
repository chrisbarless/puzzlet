import createDom2dCamera from 'dom-2d-camera';
import HexagonGrid from './components/hexagon-grid';
// import Controls from './components/controls';

const increment = 10;
const minZoom = 10;
const maxZoom = 75;

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
    isRotate: false,
    onWheel(e) {},
  });
  camera.noRotate = true;

  grid = new HexagonGrid(context);

  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();
}

function tick() {
  requestAnimationFrame(tick);

  camera.tick();
  grid.tick();
}

init();
tick();

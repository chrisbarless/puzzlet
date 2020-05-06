import HexagonGrid from './components/hexagon-grid';
import Camera from './components/camera';

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

  camera = new Camera(canvas);
  grid = new HexagonGrid(context, camera);

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

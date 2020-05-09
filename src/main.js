import HexagonGrid from './components/hexagon-grid';
import Camera from './components/camera';

let canvas;
let context;
let grid;
let camera;

function onWindowResize() {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  if (camera) {
    camera.refresh();
  }
}

function init() {
  const wordpressHeaderElement = document.getElementById('wp-custom-header');
  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  context = canvas.getContext('2d');
  if (wordpressHeaderElement) {
    wordpressHeaderElement.innerHTML = '';
    wordpressHeaderElement.appendChild(canvas);
  } else {
    document.body.appendChild(canvas);
  }

  onWindowResize();

  camera = new Camera(canvas);
  grid = new HexagonGrid(context, camera);

  if (process.env.NODE_ENV !== 'production') {
    document.getElementById('logo').removeAttribute('href');
  }

  window.addEventListener('resize', onWindowResize, false);
}

function tick() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  camera.tick();
  grid.tick();

  requestAnimationFrame(tick);
}

window.addEventListener('load', () => {
  init();
  tick();
});

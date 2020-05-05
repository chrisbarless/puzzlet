import Hexagon from './hexagon';
import HexagonGrid from './components/hexagon-grid';
import Controls from './components/controls';

let canvas;
let hexagon;
let ctx;
let grid;
let controls;

function init() {
  // scene = new THREE.Scene();

  // camera = new THREE.PerspectiveCamera(
  // 60,
  // window.innerWidth / window.innerHeight,
  // 0.1,
  // 100,
  // );

  canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  ctx = canvas.getContext('2d');
  document.body.appendChild(canvas);

  hexagon = new Hexagon(1, 1, 1, 100);

  controls = new Controls(canvas);

  // grid = new HexagonGrid(renderer, scene, camera);

  function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();
}

function tick() {
  requestAnimationFrame(tick);

  hexagon.draw(ctx);
  controls.tick();
  // grid.tick();

  // renderer.render(scene, camera);
}

init();
tick();

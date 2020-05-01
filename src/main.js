import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import HexagonGrid from './components/hexagon-grid';
import Controls from './components/controls';

let camera;
let scene;
let renderer;
let stats;
let grid;
let controls;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0xffac8c, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  stats = new Stats();
  document.body.appendChild(stats.dom);

  controls = new Controls(renderer, camera);

  grid = new HexagonGrid(renderer, scene, camera);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', onWindowResize, false);
}

function animate() {
  requestAnimationFrame(animate);

  grid.tick();

  controls.tick();

  renderer.render(scene, camera);

  stats.update();
}

init();
animate();

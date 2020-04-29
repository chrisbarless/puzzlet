import * as THREE from 'three';
import HexagonGrid from './components/hexagon-grid';

let camera;
let scene;
let renderer;
let grid;

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0xffac8c, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  grid = HexagonGrid(renderer, scene, camera);
  Controls(camera);
}

function animate() {
  requestAnimationFrame(animate);

  grid.tick();
  renderer.render(scene, camera);
}

init();
animate();

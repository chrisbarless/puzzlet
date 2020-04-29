import * as THREE from 'three';
import HexagonGrid from './components/hexagon-grid';
import Controls from './components/controls';

let camera;
let scene;
let renderer;

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

  HexagonGrid(scene);
  Controls(camera);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();

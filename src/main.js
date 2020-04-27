import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import HexagonGrid from './hexagon-grid';

let camera;
let scene;
let controls;
let renderer;
let angle = 0;

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 0, 500);

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0xffac8c, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new TrackballControls(camera, renderer.domElement);

  const light = new THREE.DirectionalLight(0xffac8c, 0.6);
  light.position.set(200, 500, 600).normalize();
  scene.add(light);

  HexagonGrid(scene);
}

function animate() {
  requestAnimationFrame(animate);

  angle -= 0.1;

  controls.update();

  renderer.render(scene, camera);
}

init();
animate();

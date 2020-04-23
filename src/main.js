import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import HexagonGrid from './hexagon-grid';

let camera;
let scene;
let controls;
let renderer;
let hexagonGrid;

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.x = -50;
  // camera.position.y = -100;
  // camera.position.z = -45;

  scene = new THREE.Scene();

  hexagonGrid = HexagonGrid(scene);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new TrackballControls(camera, renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);
}

function animate() {
  requestAnimationFrame(animate);

  // hexagon.rotation.x += 0.01;
  // hexagon.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

init();
animate();

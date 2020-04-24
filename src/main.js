import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import HexagonGrid from './hexagon-grid';

let camera;
let scene;
let controls;
let renderer;
let spotLight;
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
  renderer.setClearColor(0x333333, 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new TrackballControls(camera, renderer.domElement);

  const light = new THREE.DirectionalLight(0x969696, 0.6);
  light.position.set(200, 500, 600).normalize();
  scene.add(light);

  spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(100, 1000, 100);
  scene.add(spotLight);

  HexagonGrid(scene);
}

function animate() {
  requestAnimationFrame(animate);

  angle -= 0.1;

  spotLight.position.x = 10 + 10 * Math.sin(angle);
  spotLight.position.y = 10 + 10 * Math.cos(angle);

  controls.update();

  renderer.render(scene, camera);
}

init();
animate();

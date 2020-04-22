import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import hexagon from './hexagon';

let camera;
let scene;
let controls;
let renderer;

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  camera.position.z = 25;

  scene = new THREE.Scene();

  scene.add(hexagon);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new TrackballControls(camera, renderer.domElement);
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

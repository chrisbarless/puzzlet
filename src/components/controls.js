import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

const increment = 10;

function Controls(renderer, camera) {
  camera.position.set(0, 0, 75);
  camera.lookAt(0, 0, 0);

  const controls = new TrackballControls(camera, renderer.domElement);
  controls.noRotate = true;

  // Move Left
  document.getElementById('button-arrow-left').addEventListener('click', () => {
    camera.position.setX(camera.position.x - increment);
  });
  // Move Right
  document
    .getElementById('button-arrow-right')
    .addEventListener('click', () => {
      camera.position.setX(camera.position.x + increment);
    });
  // Move Up
  document.getElementById('button-arrow-up').addEventListener('click', () => {
    camera.position.setY(camera.position.y + increment);
  });
  // Move Down
  document.getElementById('button-arrow-down').addEventListener('click', () => {
    camera.position.setY(camera.position.y - increment);
  });
  // Zoom in
  document.getElementById('button-arrow-plus').addEventListener('click', () => {
    camera.position.setZ(camera.position.z + increment);
  });
  // Zoom out
  document
    .getElementById('button-arrow-minus')
    .addEventListener('click', () => {
      camera.position.setZ(camera.position.z - increment);
    });

  this.tick = () => {
    controls.update();
  };
}

export default Controls;

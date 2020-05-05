import createDom2dCamera from 'dom-2d-camera';

function Controls() {
  const increment = 10;
  const minZoom = 10;
  const maxZoom = 75;

  const camera = createDom2dCamera(element, {
    isRotate: false,
  });

  controls.noRotate = true;
  controls.minDistance = minZoom;
  controls.maxDistance = maxZoom;

  camera.position.set(0, 0, maxZoom);
  camera.lookAt(0, 0, 0);

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
    const zoomedVal = camera.position.z - increment;
    zoomedVal > minZoom && camera.position.setZ(zoomedVal);
  });
  // Zoom out
  document
    .getElementById('button-arrow-minus')
    .addEventListener('click', () => {
      const zoomedVal = camera.position.z + increment;
      zoomedVal < maxZoom && camera.position.setZ(zoomedVal);
    });

  this.tick = () => {
    controls.update();
  };
}

export default Controls;
